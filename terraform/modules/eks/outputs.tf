output "eks-cluster-security-group" {
  value = aws_eks_cluster.foodwaste_eks_cluster.vpc_config[0].cluster_security_group_id
}

output "cluster_name" {
  value = aws_eks_cluster.foodwaste_eks_cluster.name
}

output "cluster_endpoint" {
  value = aws_eks_cluster.foodwaste_eks_cluster.endpoint
}

output "cluster_ca" {
  value = aws_eks_cluster.foodwaste_eks_cluster.certificate_authority[0].data
}
