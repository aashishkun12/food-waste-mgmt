terraform {
  backend "s3" {
    bucket       = "foodwaste-dev-tfstate-12"
    key          = "dev/terraform.tfstate"
    region       = "ap-south-1"
    use_lockfile = true
  }
}