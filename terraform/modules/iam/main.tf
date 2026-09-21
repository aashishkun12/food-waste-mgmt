resource "aws_iam_role" "foodwaste_dev_eks_cluster_role" {
  name = "foodwaste_dev_eks_cluster_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "eks.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "foodwaste_dev_eks_cluster_role_policy_attachment" {
  role = aws_iam_role.foodwaste_dev_eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

resource "aws_iam_role" "foodwaste_dev_eks_node_role" {
  name = "foodwaste_dev_eks_node_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "foodwaste_dev_eks_node_EKSWorkerNodePolicy" {
  role = aws_iam_role.foodwaste_dev_eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "foodwaste_dev_eks_node_EKSCNIPolicy" {
  role = aws_iam_role.foodwaste_dev_eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "foodwaste_dev_eks_node_AmazonEC2ConRegReadOnly" {
  role = aws_iam_role.foodwaste_dev_eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}