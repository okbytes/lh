const qs = (key: string) => {
  const url = new URL(window.location.href)
  const param = url.searchParams.get(key)
  return param
}

export default qs
