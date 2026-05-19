import { LucideIcon } from "lucide-react"

export type  NavProjectsProps = {
    title: string
    items: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}