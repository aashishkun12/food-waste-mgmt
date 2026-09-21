output "private_db_subnet_id_1" {
  value = aws_subnet.foodwaste_dev_private_db_1.id
}

output "private_db_subnet_id_2" {
  value = aws_subnet.foodwaste_dev_private_db_2.id
}

output "db_security_group_id" {
  value = aws_security_group.foodwaste_db_sg.id
}

output "eks-private-node-1-subnet-id" {
  value = aws_subnet.foodwaste_dev_private_node_1.id
}

output "eks-private-node-2-subnet-id" {
  value = aws_subnet.foodwaste_dev_private_node_2.id
}

output "node-sec-group-id" {
  value = aws_security_group.foodwaste_node_sg.id
}