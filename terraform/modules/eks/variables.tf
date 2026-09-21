variable "eks_cluster_role_arn" {
  type = string
}

variable "eks_worker_role_arn" {
  type = string
}

variable "eks-node-1-subnet" {
  type = string
}

variable "eks-node-2-subnet" {
  type = string
}

variable "node-sg" {
  type = list(string)
}

variable "my_public_ip" {
  type = string
}