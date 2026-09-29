data "aws_caller_identity" "current" {}

resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

resource "aws_iam_role" "github_actions" {
  name = "github-actions"
   assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Principal": {
                "Federated": "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
            },
            "Condition": {
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": [
                        "sts.amazonaws.com"
                    ]
                },
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": [
                        "repo:aashishkun12/food-waste-mgmt:*"
                    ]
                }
            }
        }
    ]
  })
}


output "github_actions_role_arn" {
  value = aws_iam_role.github_actions.arn
}



resource "aws_iam_role_policy" "github_actions_ecr_push" {
  name = "ecr-push-policy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ECRAuth"
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Sid    = "ECRPushPull"
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = "arn:aws:ecr:ap-south-1:${data.aws_caller_identity.current.account_id}:repository/foodwaste"
      }
    ]
  })
}

resource "aws_iam_role_policy" "github_actions_eks" {
  name = "eks-cluster-policy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "EKSClusterManagement"
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:CreateCluster",
          "eks:UpdateClusterConfig",
          "eks:UpdateClusterVersion",
          "eks:DeleteCluster",
          "eks:ListClusters",
          "eks:TagResource",
          "eks:UntagResource"
        ]
        Resource = "*"
      }
    ]
  })
}