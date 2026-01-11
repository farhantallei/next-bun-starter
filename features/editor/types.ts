export type UploadRedactorFileResponse = {
  image: {
    image: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
      size: number // byte
    }
  }
}
