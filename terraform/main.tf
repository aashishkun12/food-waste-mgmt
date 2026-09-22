//VPC
module "aws_network" {
  source = "./modules/network"

  my_public_ip = var.my_public_ip

  vpc_cidr_block = var.vpc_cidr_block

  availability_zone_1 = var.availability_zone_1
  availability_zone_2 = var.availability_zone_2

  public_cidr_block_1 = var.public_cidr_block_1
  public_cidr_block_2 = var.public_cidr_block_2

  private_node_cidr_block_1 = var.private_node_cidr_block_1
  private_node_cidr_block_2 = var.private_node_cidr_block_2

  private_db_cidr_block_1 = var.private_db_cidr_block_1
  private_db_cidr_block_2 = var.private_db_cidr_block_2

  eks-cluster-security-group = module.aws_eks.eks-cluster-security-group
}

//RDS
module "aws_rds" {
  source = "./modules/rds"

  private_db_subnet_id_1 = module.aws_network.private_db_subnet_id_1
  private_db_subnet_id_2 = module.aws_network.private_db_subnet_id_2
  db_security_group_id   = [module.aws_network.db_security_group_id]

  db_name     = var.db_name
  db_username = var.db_username
  db_password = var.db_password
}

//ECR
module "aws_ecr" {
  source = "./modules/ecr"
}

// IAM
module "aws_iam" {
  source = "./modules/iam"
}

// EKS
module "aws_eks" {
  source = "./modules/eks"

  //cluster
  eks_cluster_role_arn = module.aws_iam.foodwaste_eks_cluster_role_arn
  eks-node-1-subnet    = module.aws_network.eks-private-node-1-subnet-id
  eks-node-2-subnet    = module.aws_network.eks-private-node-2-subnet-id
  node-sg              = [module.aws_network.node-sec-group-id]

  my_public_ip = var.my_public_ip

  //node group
  eks_worker_role_arn = module.aws_iam.foodwaste_eks_worker_role_arn
}

module "alb_controller" {
  source = "./modules/alb-controller"

  providers = {
    helm = helm
  }

  cluster_name            = module.aws_eks.cluster_name
  region                  = var.aws_region
  vpc_id                  = module.aws_network.vpc_id
  alb_controller_role_arn = module.aws_iam.alb_controller_role_arn

  depends_on = [module.aws_eks]
}

