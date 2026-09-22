// my public ip
variable "my_public_ip" {
  type = string
}
//Region
variable "aws_region" {
  type = string
}

// VPC

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


// RDS
variable "db_name" {
  type    = string
  default = "food_waste_db"
}

variable "db_username" {
  type = string
}

variable "db_password" {
  type      = string
  sensitive = true
}

