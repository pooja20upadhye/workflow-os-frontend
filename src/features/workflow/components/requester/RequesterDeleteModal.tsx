import { Button } from '@/components/ui/button'
import { Modal } from '@/components/shared/Modal'
import { Workflow } from '../../types/workflowTypes'

interface RequesterDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  workflow: Workflow | null
}

export const RequesterDeleteModal = ({ isOpen, onClose, onConfirm, workflow }: RequesterDeleteModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Workflow"
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete <strong>"{workflow?.title}"</strong>? This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}