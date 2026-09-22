output "foodwaste_eks_cluster_role_arn" {
  description = "ARN of the IAM role used by the EKS control plane"
  value       = aws_iam_role.foodwaste_dev_eks_cluster_role.arn
}

output "foodwaste_eks_worker_role_arn" {
  description = "ARN of the IAM role used by EKS worker nodes"
  value       = aws_iam_role.foodwaste_dev_eks_node_role.arn
}


output "alb_controller_role_arn" {
  description = "ARN of the IAM role used by the AWS Load Balancer Controller"
  value       = aws_iam_role.alb_controller.arn
}