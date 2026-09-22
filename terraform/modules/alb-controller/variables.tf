variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
}

variable "region" {
  description = "AWS region the cluster is in"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID the cluster runs in"
  type        = string
}

variable "alb_controller_role_arn" {
  description = "IAM role ARN for the controller, from the iam module"
  type        = string
}