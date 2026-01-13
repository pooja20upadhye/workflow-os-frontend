import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Modal } from '@/components/shared/Modal'
import { Workflow, UpdateWorkflowRequest } from '../../types/workflowTypes'

interface RequesterEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UpdateWorkflowRequest) => void
  workflow: Workflow | null
}

export const RequesterEditModal = ({ isOpen, onClose, onSubmit, workflow }: RequesterEditModalProps) => {
  const [formData, setFormData] = useState<UpdateWorkflowRequest>({
    title: '',
    description: '',
    category: ''
  })

  useEffect(() => {
    if (workflow) {
      setFormData({
        title: workflow.title,
        description: workflow.description,
        category: workflow.category,
        priority: workflow.priority
      })
    }
  }, [workflow])

  const handleSubmit = () => {
    if (!formData.title?.trim() || !formData.description?.trim()) {
      alert('Title and description are required')
      return
    }
    onSubmit(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({ title: '', description: '', category: '' })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Workflow Request"
      size="lg"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="edit-title">Title *</Label>
          <Input
            id="edit-title"
            value={formData.title || ''}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Enter workflow title"
          />
        </div>

        <div>
          <Label htmlFor="edit-description">Description *</Label>
          <Textarea
            id="edit-description"
            value={formData.description || ''}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Enter detailed description"
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="edit-category">Category</Label>
          <Input
            id="edit-category"
            value={formData.category || ''}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            placeholder="Enter category"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Update Workflow
          </Button>
        </div>
      </div>
    </Modal>
  )
}