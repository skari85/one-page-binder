"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Save, X } from "lucide-react"

interface Tag {
  id: string
  name: string
  color: string
  description?: string
}

interface ContentSection {
  id: string
  content: string
  tags: string[]
  timestamp: number
}

interface TagManagerProps {
  tags: Tag[]
  onCreateTag: (name: string, color?: string) => Tag
  onDeleteTag: (tagId: string) => void
  contentSections: ContentSection[]
}

const TAG_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
]

export function TagManager({ tags, onCreateTag, onDeleteTag, contentSections }: TagManagerProps) {
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0])
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      onCreateTag(newTagName.trim(), newTagColor)
      setNewTagName("")
      setNewTagColor(TAG_COLORS[0])
    }
  }

  const startEditing = (tag: Tag) => {
    setEditingTag(tag.id)
    setEditName(tag.name)
  }

  const cancelEditing = () => {
    setEditingTag(null)
    setEditName("")
  }

  const getTagUsageCount = (tagId: string) => {
    return contentSections.filter((section) => section.tags.includes(tagId)).length
  }

  const getTaggedContent = (tagId: string) => {
    return contentSections
      .filter((section) => section.tags.includes(tagId))
      .map((section) => ({
        ...section,
        preview: section.content.slice(0, 100) + (section.content.length > 100 ? "..." : ""),
      }))
  }

  return (
    <div className="space-y-6">
      {/* Create New Tag */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create New Tag</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="tag-name">Tag Name</Label>
              <Input
                id="tag-name"
                placeholder="Enter tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
              />
            </div>
            <div>
              <Label>Color</Label>
              <div className="flex gap-1 mt-1">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded border-2 ${
                      newTagColor === color ? "border-foreground" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewTagColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Tag
          </Button>
        </CardContent>
      </Card>

      {/* Existing Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Manage Tags ({tags.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tags.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No tags created yet. Create your first tag above.</p>
          ) : (
            <div className="space-y-4">
              {tags.map((tag) => {
                const usageCount = getTagUsageCount(tag.id)
                const taggedContent = getTaggedContent(tag.id)

                return (
                  <div key={tag.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {editingTag === tag.id ? (
                          <div className="flex items-center gap-2">
                            <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-32" />
                            <Button size="sm" onClick={cancelEditing}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEditing}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Badge style={{ backgroundColor: tag.color, color: "white" }} className="text-sm">
                              {tag.name}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Used in {usageCount} section{usageCount !== 1 ? "s" : ""}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(tag)}
                          disabled={editingTag === tag.id}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteTag(tag.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Tagged Content Preview */}
                    {taggedContent.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Tagged Content:</Label>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {taggedContent.map((section) => (
                            <div
                              key={section.id}
                              className="text-xs bg-muted/50 rounded p-2 border-l-2"
                              style={{ borderLeftColor: tag.color }}
                            >
                              <div className="font-mono text-muted-foreground mb-1">
                                {new Date(section.timestamp).toLocaleString()}
                              </div>
                              <div className="text-foreground">{section.preview}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      {tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tag Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total content sections: {contentSections.length}</div>
              <div className="text-sm text-muted-foreground">
                Tagged sections: {contentSections.filter((s) => s.tags.length > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">
                Most used tag:{" "}
                {tags.length > 0
                  ? tags.reduce((prev, current) =>
                      getTagUsageCount(current.id) > getTagUsageCount(prev.id) ? current : prev,
                    ).name
                  : "None"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
