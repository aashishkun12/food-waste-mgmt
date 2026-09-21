// Create a vpc
resource "aws_vpc" "foodwaste_dev_vpc" {
  cidr_block = var.vpc_cidr_block
  enable_dns_hostnames = true
  tags = {
    Name = "foodwaste-dev-vpc"
  }
}

resource "aws_internet_gateway" "foodwaste_dev_igw" {
  vpc_id = aws_vpc.foodwaste_dev_vpc.id
  tags = {
    Name = "foodwaste-dev-igw"
  }
}
// Create public subnets
resource "aws_subnet" "foodwaste_dev_public_subnet_1" {
  vpc_id = aws_vpc.foodwaste_dev_vpc.id
  availability_zone = var.availability_zone_1
  cidr_block = var.public_cidr_block_1
  tags = {
    Name = "foodwaste_dev_public_subnet_1",
    "kubernetes.io/role/elb" = "1"
  }
}

resource "aws_subnet" "foodwaste_dev_public_subnet_2" {
  vpc_id = aws_vpc.foodwaste_dev_vpc.id
  availability_zone = var.availability_zone_2
  cidr_block = var.public_cidr_block_2
  tags = {
    Name = "foodwaste_dev_public_subnet_2",
    "kubernetes.io/role/elb" = "1"
  }
}

// Create a route table
resource "aws_route_table" "foodwaste_dev_rt_public" {
    vpc_id = aws_vpc.foodwaste_dev_vpc.id
    route {
      cidr_block = "0.0.0.0/0"
      gateway_id = aws_internet_gateway.foodwaste_dev_igw.id
    }
    tags = {
      Name = "foodwaste_dev_rt_public"
    }
}

// route table association
resource "aws_route_table_association" "foodwaste_dev_public_rta_1" {
  route_table_id = aws_route_table.foodwaste_dev_rt_public.id
  subnet_id = aws_subnet.foodwaste_dev_public_subnet_1.id
}

resource "aws_route_table_association" "foodwaste_dev_public_rta_2" {
  route_table_id = aws_route_table.foodwaste_dev_rt_public.id
  subnet_id = aws_subnet.foodwaste_dev_public_subnet_2.id
}


// Create private subnet for node
resource "aws_subnet" "foodwaste_dev_private_node_1" {
  vpc_id = aws_vpc.foodwaste_dev_vpc.id
  availability_zone = var.availability_zone_1
  cidr_block = var.private_node_cidr_block_1
  tags = {
    Name = "foodwaste_dev_private_node_1",
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_subnet" "foodwaste_dev_private_node_2" {
  vpc_id = aws_vpc.foodwaste_dev_vpc.id
  availability_zone = var.availability_zone_2
  cidr_block = var.private_node_cidr_block_2
  tags = {
    Name = "foodwaste_dev_private_node_2",
    "kubernetes.io/role/internal-elb" = "1"
  }
}

// Create private subnet for DB
resource "aws_subnet" "foodwaste_dev_private_db_1" {
  vpc_id = aws_vpc.foodwaste_dev_vpc.id
  availability_zone = var.availability_zone_1
  cidr_block = var.private_db_cidr_block_1
  tags = {
    Name = "foodwaste_dev_private_db_1"
  }
}

resource "aws_subnet" "foodwaste_dev_private_db_2" {
  vpc_id = aws_vpc.foodwaste_dev_vpc.id
  availability_zone = var.availability_zone_2
  cidr_block = var.private_db_cidr_block_2
  tags = {
    Name = "foodwaste_dev_private_db_2"
  }
}

// Elastic IP
resource "aws_eip" "foodwaste_eip_1" {
  domain = "vpc"
  tags = {
    Name = "eip-1"
  }
}

resource "aws_eip" "foodwaste_eip_2" {
  domain = "vpc"
  tags = {
    Name = "eip-2"
  }
}

// NAT Gateway
resource "aws_nat_gateway" "foodwaste_dev_nat_1" {
  subnet_id = aws_subnet.foodwaste_dev_public_subnet_1.id
  allocation_id = aws_eip.foodwaste_eip_1.id
  tags = {
    Name = "nat-gw-1"
  }
}

resource "aws_nat_gateway" "foodwaste_dev_nat_2" {
  subnet_id = aws_subnet.foodwaste_dev_public_subnet_2.id
  allocation_id = aws_eip.foodwaste_eip_2.id
  tags = {
    Name = "nat-gw-2"
  }
}

//Private Route Table 
resource "aws_route_table" "foodwaste_private_rt_1" {
  vpc_id = aws_vpc.foodwaste_dev_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.foodwaste_dev_nat_1.id
  }
  tags = {
    Name = "foodwaste-dev-rt-private-1"
  }
}

resource "aws_route_table" "foodwaste_private_rt_2" {
  vpc_id = aws_vpc.foodwaste_dev_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.foodwaste_dev_nat_2.id
  }
  tags = {
    Name = "foodwaste-dev-rt-private-2"
  }
}

// PRivate route table association
resource "aws_route_table_association" "foodwaste_private_rta_1" {
  route_table_id = aws_route_table.foodwaste_private_rt_1.id
  subnet_id = aws_subnet.foodwaste_dev_private_node_1.id
}

resource "aws_route_table_association" "foodwaste_private_rta_2" {
  route_table_id = aws_route_table.foodwaste_private_rt_2.id
  subnet_id = aws_subnet.foodwaste_dev_private_node_2.id
}

// Security groups
resource "aws_security_group" "foodwaste_alb_sg" {
  name        = "foodwaste-alb-sg"
  description = "Security group for the public ALB"
  vpc_id      = aws_vpc.foodwaste_dev_vpc.id

  tags = {
    Name = "foodwaste-alb-sg"
  }
}

resource "aws_security_group" "foodwaste_node_sg" {
  name        = "foodwaste-node-sg"
  description = "Security group for the nodes"
  vpc_id      = aws_vpc.foodwaste_dev_vpc.id

  tags = {
    Name = "foodwaste-node-sg"
  }
}

resource "aws_security_group" "foodwaste_db_sg" {
  name        = "foodwaste-db-sg"
  description = "Security group for RDS"
  vpc_id      = aws_vpc.foodwaste_dev_vpc.id

  tags = {
    Name = "foodwaste-db-sg"
  }
}

// Internet -> ALB
resource "aws_vpc_security_group_ingress_rule" "alb_http" {
  security_group_id = aws_security_group.foodwaste_alb_sg.id

  cidr_ipv4   = "0.0.0.0/0"
  from_port   = 80
  to_port     = 80
  ip_protocol = "tcp"
}

// ALB -> nodes
resource "aws_vpc_security_group_egress_rule" "alb_to_nodes" {
  security_group_id            = aws_security_group.foodwaste_alb_sg.id
  referenced_security_group_id = aws_security_group.foodwaste_node_sg.id

  from_port   = 80
  to_port     = 80
  ip_protocol = "tcp"
}

// ALB -> nodes
resource "aws_vpc_security_group_ingress_rule" "nodes_from_alb" {
  security_group_id            = aws_security_group.foodwaste_node_sg.id
  referenced_security_group_id = aws_security_group.foodwaste_alb_sg.id

  from_port   = 80
  to_port     = 80
  ip_protocol = "tcp"
}

// Nodes -> ECR
resource "aws_vpc_security_group_egress_rule" "nodes_to_ecr" {
  security_group_id = aws_security_group.foodwaste_node_sg.id

  cidr_ipv4   = "${var.my_public_ip}/32"
  ip_protocol = "-1"
}

resource "aws_vpc_security_group_ingress_rule" "db_from_nodes" {
  security_group_id            = aws_security_group.foodwaste_db_sg.id
  referenced_security_group_id = var.eks-cluster-security-group

  from_port   = 5432
  to_port     = 5432
  ip_protocol = "tcp"
}

