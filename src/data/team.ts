import team from './team.json'

// Exported from the Framer CMS collection "Team". bioHtml is the CMS rich-text field.
export type TeamMember = {
  slug: string
  order: number
  name: string
  role: string
  hook: string
  title: string
  image: string
  bioHtml: string
}

export const TEAM: TeamMember[] = team
