variable "private_db_subnet_id_1" {
  type = string
}

variable "private_db_subnet_id_2" {
  type = string
}

variable "db_security_group_id" {
  type = list(string)
}

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