resource "aws_db_subnet_group" "foodwaste_dev_db_subnets" {
  name       = "foodwaste_db_subnets"
  subnet_ids = [var.private_db_subnet_id_1, var.private_db_subnet_id_2]

  tags = {
    Name = "foodwaste_db_subnets"
  }
}

resource "aws_db_instance" "food_waste_db" {
  allocated_storage    = 20
  db_name              = var.db_name
  engine               = "postgres"
  engine_version       = "18.3"
  instance_class       = "db.t3.micro"
  username             = var.db_username
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.foodwaste_dev_db_subnets.name
  vpc_security_group_ids = var.db_security_group_id
  skip_final_snapshot  = true
}
