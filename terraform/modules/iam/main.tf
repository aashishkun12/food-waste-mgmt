// Cluster Role

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



//Node ROle 

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



// ALB controller role + policy

data "http" "alb_controller_iam_policy" {
  url = "https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v3.5.0/docs/install/iam_policy.json"
}

resource "aws_iam_policy" "alb_controller" {
  name   = "foodwaste-dev-alb-controller-policy"
  policy = data.http.alb_controller_iam_policy.response_body
}

resource "aws_iam_role" "alb_controller" {
  name = "foodwaste-dev-alb-controller-role"

  // Pod Identity trust policy - trusts the EKS Pod Identity service, not OIDC.
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "pods.eks.amazonaws.com" }
        Action    = ["sts:AssumeRole", "sts:TagSession"]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "alb_controller" {
  role       = aws_iam_role.alb_controller.name
  policy_arn = aws_iam_policy.alb_controller.arn
}