resource "aws_ecr_repository" "foodwaste" {
  name = "foodwaste"
  image_tag_mutability = "MUTABLE"
}