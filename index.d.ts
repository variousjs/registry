export interface Package {
  name: string,
  description: string,
  homepage: string,
  'dist-tags': Record<'latest', string>,
  versions: Record<string, {
    dist: string,
    dependencies?: Record<string, string>,
  }>,
}
