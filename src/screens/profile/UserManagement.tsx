import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function UserManagement({ users, makeAdmin, deleteUser, updateUser, currentUserId }: any) {
  const { t } = useTranslation('profile')
  const [editingUser, setEditingUser] = useState<any>(null)
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '' })
  
  const handleEdit = (user: any) => {
    setEditingUser(user)
    setEditForm({ name: user.name || '', email: user.email, role: user.role })
  }
  
  const handleUpdate = async () => {
    await updateUser.mutateAsync({
      id: editingUser.id,
      name: editForm.name,
      email: editForm.email,
      role: editForm.role
    })
    setEditingUser(null)
  }
  
  if (!users) return <div>{t('loading')}</div>
  
  return (
    <>
      <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">{t('user_management')}</h2>
      
      {editingUser && (
        <div className="mb-4 p-3 sm:p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-3 text-sm sm:text-base">{t('edit_user')}: {editingUser.email}</h3>
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              placeholder={t('name_label')}
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="px-3 py-2 bg-background border border-input rounded text-sm"
            />
            <input
              type="email"
              placeholder={t('email_label')}
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="px-3 py-2 bg-background border border-input rounded text-sm"
            />
            <select
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="px-3 py-2 bg-background border border-input rounded text-sm"
            >
              <option value="USER">{t('user')}</option>
              <option value="ADMIN">{t('admin')}</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleUpdate}
              disabled={updateUser.isPending}
              className="flex-1 px-3 py-2 bg-green-500 text-white rounded text-sm"
            >
              {t('save')}
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="flex-1 px-3 py-2 bg-gray-500 text-white rounded text-sm"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">{t('email_label')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">{t('name_label')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">{t('role_label')}</th>
                <th className="hidden sm:table-cell px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">{t('created_label')}</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm break-all max-w-[120px] sm:max-w-none">
                    {user.email}
                  </td>
                  <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm">{user.name || '-'}</td>
                  <td className="px-3 sm:px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs whitespace-nowrap ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-500/20 text-purple-500' 
                        : 'bg-blue-500/20 text-blue-500'
                    }`}>
                      {user.role === 'ADMIN' ? t('admin') : t('user')}
                    </span>
                   </td>
                  <td className="hidden sm:table-cell px-3 sm:px-4 py-2 text-xs sm:text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                   </td>
                  <td className="px-3 sm:px-4 py-2">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded text-xs whitespace-nowrap"
                      >
                        {t('edit')}
                      </button>
                      
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => makeAdmin.mutate({ id: user.id })}
                          className="px-2 sm:px-3 py-1 bg-purple-500 text-white rounded text-xs whitespace-nowrap"
                        >
                          {t('make_admin')}
                        </button>
                      )}
                      
                      {user.id !== currentUserId && (
                        <button
                          onClick={() => {
                            if (confirm(t('delete_confirm', { email: user.email }))) {
                              deleteUser.mutate({ id: user.id })
                            }
                          }}
                          className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded text-xs whitespace-nowrap"
                        >
                          {t('delete')}
                        </button>
                      )}
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        {t('total_users', { count: users.length })}
      </p>
    </>
  )
}