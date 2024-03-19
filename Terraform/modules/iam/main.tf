# ECS-S3-ACCESS ROLE

resource "aws_iam_role" "ecs_s3_access" {
  name = "ECS-S3-ACCESS"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        },
        Effect = "Allow",
        Sid    = "",
      },
    ],
  })
}

resource "aws_iam_policy" "ecs_s3_access_policy" {
  name   = "ecs-s3-access-policy"
  policy = file("${path.module}/policies/ecs_s3_access_policy.json")
}

resource "aws_iam_role_policy_attachment" "ecs_s3_access_policy_attachment" {
  role       = aws_iam_role.ecs_s3_access.name
  policy_arn = aws_iam_policy.ecs_s3_access_policy.arn
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_s3_access.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecr_read_only" {
  role       = aws_iam_role.ecs_s3_access.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# CODEBUILD ROLE

resource "aws_iam_role" "codebuild_role" {
  name = "CodeBuildServiceRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "codebuild.amazonaws.com"
        },
        Action = "sts:AssumeRole",
      },
    ],
  })
}

resource "aws_iam_policy" "codebuild_cloudwatch_logs_policy" {
  name        = "CodeBuildCloudWatchLogsPolicy"
  description = "Allow CodeBuild to create and manage CloudWatch Logs"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Action    = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource  = "arn:aws:logs:eu-north-1:143898400191:*"
      },
    ],
  })
}

resource "aws_iam_role_policy_attachment" "codebuild_cloudwatch_logs_policy_attachment" {
  role       = aws_iam_role.codebuild_role.name
  policy_arn = aws_iam_policy.codebuild_cloudwatch_logs_policy.arn
}

resource "aws_iam_policy" "codebuild_s3_policy" {
  name   = "codebuild-s3-access-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject",
          "s3:GetObjectVersion",
          "s3:PutObject"
        ],
        Resource = [
          "arn:aws:s3:::eduapp-pipeline-bucket/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "codebuild_s3_policy_attachment" {
  role       = aws_iam_role.codebuild_role.name
  policy_arn = aws_iam_policy.codebuild_s3_policy.arn
}

resource "aws_iam_policy" "codebuild_ecr_policy" {
  name   = "codebuild-ecr-policy-eduapp"
  policy = file("${path.module}/policies/codebuild_ecr_policy.json")
}

resource "aws_iam_role_policy_attachment" "codebuild_base_policy_attachment" {
  role       = aws_iam_role.codebuild_role.id
  policy_arn = "arn:aws:iam::aws:policy/AWSCodeBuildAdminAccess"
}

resource "aws_iam_role_policy_attachment" "codebuild_ecr_policy_attachment" {
  role       = aws_iam_role.codebuild_role.name
  policy_arn = aws_iam_policy.codebuild_ecr_policy.arn
}

# LAMBDA ROLE

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Effect = "Allow",
      Sid = "",
    }],
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name   = "codebuild-ecr-policy"
  policy = file("${path.module}/policies/codebuild_ecr_policy.json")
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

# CODEPIPELINE ROLE

resource "aws_iam_role" "codepipeline_role" {
  name = "CodepipelineServiceRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = "codepipeline.amazonaws.com"
        },
        Action = "sts:AssumeRole",
      },
    ],
  })
}

resource "aws_iam_policy" "codepipeline_policy" {
  name   = "codepipeline-policy"
  policy = file("${path.module}/policies/codepipeline_policy.json")
}

resource "aws_iam_role_policy_attachment" "codepipeline_policy_attachment" {
  role       = aws_iam_role.codepipeline_role.name
  policy_arn = aws_iam_policy.codepipeline_policy.arn
}