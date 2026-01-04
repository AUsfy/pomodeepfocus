st_name="pomostaticst"
npm run build

az storage blob service-properties update --account-name $st_name --static-website --index-document index.html --404-document index.html
