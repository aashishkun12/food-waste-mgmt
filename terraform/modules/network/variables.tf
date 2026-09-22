variable "my_public_ip" {
  type = string
}

variable "vpc_cidr_block" {
  description = "CIDR block defines the IP address range for the VPC"
  type        = string
}

variable "availability_zone_1" {
  description = "Availability Zone for the subnet"
  type        = string
}

variable "availability_zone_2" {
  description = "Availability Zone for the subnet"
  type        = string
}

variable "public_cidr_block_1" {
  description = "CIDR block for the public subnet"
  type        = string
}

variable "public_cidr_block_2" {
  description = "CIDR block for the public subnet"
  type        = string
}

variable "private_node_cidr_block_1" {
  description = "CIDR block for the node private subnet"
  type        = string
}

variable "private_node_cidr_block_2" {
  description = "CIDR block for the node private subnet"
  type        = string
}

variable "private_db_cidr_block_1" {
  description = "CIDR block for the database private subnet"
  type        = string
}

variable "private_db_cidr_block_2" {
  description = "CIDR block for the database private subnet"
  type        = string
}

variable "eks-cluster-security-group" {
  type = string
}