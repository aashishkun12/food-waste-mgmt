output "foodwaste_eks_cluster_role_arn" {
  value = aws_iam_role.foodwaste_dev_eks_cluster_role.arn
}

output "foodwaste_eks_worker_role_arn" {
  value = aws_iam_role.foodwaste_dev_eks_node_role.arn
}