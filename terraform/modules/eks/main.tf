resource "aws_eks_cluster" "foodwaste_eks_cluster" {
  name = "foodwaste_eks_cluster"
  access_config {
    authentication_mode = "API"
  }

  role_arn = var.eks_cluster_role_arn
  version  = "1.36"

  vpc_config {
    subnet_ids         = [var.eks-node-1-subnet, var.eks-node-2-subnet]
    security_group_ids = var.node-sg

    endpoint_public_access  = true
    endpoint_private_access = true

    public_access_cidrs = [
      "${var.my_public_ip}/32"
    ]
  }
}

resource "aws_eks_node_group" "foodwaste_eks_node_group" {
  node_group_name = "foodwaste-eks-node-group"
  cluster_name    = aws_eks_cluster.foodwaste_eks_cluster.name
  node_role_arn   = var.eks_worker_role_arn
  ami_type        = "AL2023_x86_64_STANDARD"
  instance_types  = ["t3.small"]
  disk_size       = "20"
  subnet_ids      = [var.eks-node-1-subnet, var.eks-node-2-subnet]
  scaling_config {
    desired_size = 2
    max_size     = 2
    min_size     = 1
  }
  update_config {
    max_unavailable = 1
  }

  depends_on = [
    aws_eks_cluster.foodwaste_eks_cluster
  ]
}


data "aws_caller_identity" "current" {}

resource "aws_eks_access_entry" "cluster_admin" {
  cluster_name  = aws_eks_cluster.foodwaste_eks_cluster.name
  principal_arn = data.aws_caller_identity.current.arn
  type          = "STANDARD"
}

resource "aws_eks_access_policy_association" "cluster_admin" {
  cluster_name  = aws_eks_cluster.foodwaste_eks_cluster.name
  principal_arn = aws_eks_access_entry.cluster_admin.principal_arn
  policy_arn    = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"

  access_scope {
    type = "cluster"
  }
}