library(tidymodels)
library(xgboost)
library(openxlsx)

load("E:/BaiduNetdiskWorkspace/Ovarian_response/web_implementation/shiny_ovarianresp/forshiny.RData")

ningbo <- read.xlsx("E:/BaiduNetdiskWorkspace/Ovarian_response/XGBoost_top_other/ningbo(exteral validation).xlsx") %>%
  mutate_if(is.character, as.factor)

por_rec <- extract_recipe(pordm_final_wfversion)
hor_rec <- extract_recipe(hordm_final_wfversion)
por_xgb <- extract_fit_parsnip(pordm_final_wfversion)$fit
hor_xgb <- extract_fit_parsnip(hordm_final_wfversion)$fit

por_baked <- por_rec %>% bake(new_data = ningbo)
hor_baked <- hor_rec %>% bake(new_data = ningbo)

# Use feature_names to ensure correct column order
por_features <- por_xgb$feature_names
hor_features <- hor_xgb$feature_names

por_mat <- xgb.DMatrix(as.matrix(por_baked[, por_features]))
hor_mat <- xgb.DMatrix(as.matrix(hor_baked[, hor_features]))

por_prob <- predict(por_xgb, por_mat)
hor_prob <- predict(hor_xgb, hor_mat)

# Verify: check first 10 predictions vs actual labels
cat("First 10 POR probs:", round(por_prob[1:10], 3), "\n")
cat("First 10 POR actual:", as.character(ningbo$POR[1:10]), "\n")
cat("First 10 HOR probs:", round(hor_prob[1:10], 3), "\n")
cat("First 10 HOR actual:", as.character(ningbo$HOR[1:10]), "\n\n")

cat("Mean POR prob:", round(mean(por_prob), 3), "\n")
cat("Mean HOR prob:", round(mean(hor_prob), 3), "\n")
cat("POR prob > 0.5:", sum(por_prob > 0.5), "/", length(por_prob), "\n")
cat("HOR prob > 0.5:", sum(hor_prob > 0.5), "/", length(hor_prob), "\n")
