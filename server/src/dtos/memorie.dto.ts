export interface CreateMemoryDTO {
  coverUrl:  string,
  content:   string,
  isPublic:  boolean
}


export interface UpdateMemoryDTO {
  coverUrl?:  string,
  content?:   string,
  isPublic?:  boolean
}
