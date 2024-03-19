resource "aws_cognito_user_pool" "eduapp_user_pool" {
  name = "eduapp_user_pool"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true

    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "eduapp_user_pool_client" {
  name                                 = "eduapp_user_pool_client"
  user_pool_id                         = aws_cognito_user_pool.eduapp_user_pool.id
  explicit_auth_flows                  = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  generate_secret                      = false
}
