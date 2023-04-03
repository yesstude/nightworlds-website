export const uploadSkin = async (file: File): Promise<string | null> => {
  const filename = encodeURIComponent(file.name)
  const fileType = encodeURIComponent(file.type)

  const res = await fetch(
    `/api/upload-skin-url?file=${filename}&fileType=${fileType}`
  )
  const { url, fields, fileurl } = await res.json()
  const formData = new FormData()

  Object.entries({ ...fields, file }).forEach(([fkey, value]) => {
    formData.append(fkey, value as string)
  })

  const upload = await fetch(url, {
    method: 'POST',
    body: formData,
  })

  if (upload.status >= 200 && upload.status < 300) return fileurl;
  else return null;
}