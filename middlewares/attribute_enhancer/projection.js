function projectionHandler(keys, createAlias) {
  return keys
    .split(',')
    .map(k => createAlias(k.trim()).aliasAttribute)
    .join(', ')
}

export { projectionHandler }
