export default {
  "*.ts": ["oxlint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"],
};
