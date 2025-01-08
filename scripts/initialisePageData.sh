folderPaths=("public/page-data/portfolio/" "public/page-data/blog/")
for folder in ${folderPaths[@]};
do
  file="${folder}page-data.json"
  if [ ! -f "${file}" ]; then
    echo "Creating page data for $folder"
    mkdir -p $folder
    touch $file
    echo {} >> $file
  fi
done