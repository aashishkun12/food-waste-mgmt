provider "aws" {
  region = "ap-south-1"
}

resource "aws_s3_bucket" "foodwaste_dev_tfstate" {
  bucket = "foodwaste-dev-tfstate-12"
  force_destroy = true
  tags = {
    Name = "foodwaste-dev-tfstate-12"
  }
}

resource "aws_s3_bucket_versioning" "bucket-version" {
  bucket = aws_s3_bucket.foodwaste_dev_tfstate.id
  versioning_configuration {
    status = "Enabled"
  }
}