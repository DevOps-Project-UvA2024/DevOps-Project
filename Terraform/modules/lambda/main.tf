resource "aws_lambda_function" "eduapp_db_initializer" {
  function_name = "eduapp_db_communicator"

  filename = "${path.module}/initDB.zip"

  handler = "index.handler"
  runtime = "nodejs20.x"
  role    = var.lambda_role_arn

  vpc_config {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [var.eduapp_ecr_sg_id]
  }

  environment {
    variables = {
      host     = var.db_endpoint
      user     = var.db_username
      password = var.db_password
    }
  }
}