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

por_mat <- xgb.DMatrix(as.matrix(por_baked[, por_xgb$feature_names]))
hor_mat <- xgb.DMatrix(as.matrix(hor_baked[, hor_xgb$feature_names]))

# Raw predict returns P(No) — tidymodels maps first factor level as positive
# P(Yes) = 1 - raw_prob
por_prob_yes <- 1 - predict(por_xgb, por_mat)
hor_prob_yes <- 1 - predict(hor_xgb, hor_mat)

# Verify direction
cat("First 5 POR P(Yes):", round(por_prob_yes[1:5], 3), "\n")
cat("First 5 POR actual:", as.character(ningbo$POR[1:5]), "\n")
cat("First 5 HOR P(Yes):", round(hor_prob_yes[1:5], 3), "\n")
cat("First 5 HOR actual:", as.character(ningbo$HOR[1:5]), "\n\n")

# Overlap analysis
por_pos <- por_prob_yes > 0.5
hor_pos <- hor_prob_yes > 0.5
both_pos <- por_pos & hor_pos
n <- nrow(ningbo)

cat("=== Overlapping Prediction Analysis ===\n")
cat(sprintf("Total patients: %d\n", n))
cat(sprintf("POR positive: %d (%.2f%%)\n", sum(por_pos), sum(por_pos)/n*100))
cat(sprintf("HOR positive: %d (%.2f%%)\n", sum(hor_pos), sum(hor_pos)/n*100))
cat(sprintf("Both positive (conflict): %d (%.2f%%)\n",
            sum(both_pos), sum(both_pos)/n*100))

if (sum(both_pos) > 0) {
  pp <- por_prob_yes[both_pos]
  hp <- hor_prob_yes[both_pos]
  cat(sprintf("\nPrimary POR: %d, Primary HOR: %d\n",
              sum(pp > hp), sum(hp >= pp)))
  cat(sprintf("Mean POR prob: %.3f, Mean HOR prob: %.3f\n",
              mean(pp), mean(hp)))
}
