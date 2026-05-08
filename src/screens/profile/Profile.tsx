import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'
import { trpc } from '@/lib/trpc'
import { PAGES } from '@/config/pages.config'
import {NewsForm} from '@/components/news/NewsForm'

export function Profile() {
	const { user, isLoading, logout } = useAuth()
	const navigate = useNavigate()
	const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'news'>('profile')
	
	const { data: users, refetch: refetchUsers } = trpc.admin.getAllUsers.useQuery(undefined, {
		enabled: user?.role === 'ADMIN'
	})
	
	const { data: news, refetch: refetchNews } = trpc.news.getAllAdmin.useQuery(undefined, {
		enabled: user?.role === 'ADMIN'
	})
	
	const makeAdmin = trpc.admin.makeAdmin.useMutation({ onSuccess: () => refetchUsers() })
	const deleteUser = trpc.admin.deleteUser.useMutation({ onSuccess: () => refetchUsers() })
	const updateUser = trpc.admin.updateUser.useMutation({ onSuccess: () => refetchUsers() })
	
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background">
				<div className="text-muted-foreground">Loading...</div>
			</div>
		)
	}
	
	if (!user) {
		navigate(PAGES.LOGIN)
		return null
	}
	
	const isAdmin = user.role === 'ADMIN'
	
	return (
		<div className="flex items-center justify-center min-h-screen bg-background p-4">
			<div className="w-full max-w-4xl bg-card rounded-xl shadow-lg border border-border overflow-hidden">
				<div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10" />
				
				<div className="relative px-6 pb-6">
					<div className="flex flex-col items-center -mt-12 sm:flex-row sm:items-end sm:justify-between">
						<div className="flex flex-col items-center sm:flex-row sm:items-end gap-4">
							<div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-4 border-card">
								<span className="text-3xl font-bold text-primary">
									{user.email?.[0]?.toUpperCase() || 'U'}
								</span>
							</div>
							
							<div className="text-center sm:text-left">
								<div className="flex items-center gap-2">
									<h1 className="text-2xl font-bold text-foreground">
										{user.name || user.email?.split('@')[0] || 'User'}
									</h1>
									{isAdmin && (
										<span className="px-2 py-1 bg-purple-500/20 text-purple-500 rounded text-xs font-medium">
											Admin
										</span>
									)}
								</div>
								<p className="text-sm text-muted-foreground">{user.email}</p>
							</div>
						</div>
						
						<button
							onClick={logout}
							className="mt-4 sm:mt-0 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors font-medium"
						>
							Sign Out
						</button>
					</div>
				</div>
				
				{isAdmin && (
					<div className="border-b border-border px-6">
						<div className="flex gap-4">
							<button
								onClick={() => setActiveTab('profile')}
								className={`px-4 py-2 font-medium transition-colors border-b-2 ${
									activeTab === 'profile'
										? 'border-primary text-primary'
										: 'border-transparent text-muted-foreground hover:text-foreground'
								}`}
							>
								Profile
							</button>
							<button
								onClick={() => setActiveTab('users')}
								className={`px-4 py-2 font-medium transition-colors border-b-2 ${
									activeTab === 'users'
										? 'border-primary text-primary'
										: 'border-transparent text-muted-foreground hover:text-foreground'
								}`}
							>
								Users Management
							</button>
							<button
								onClick={() => setActiveTab('news')}
								className={`px-4 py-2 font-medium transition-colors border-b-2 ${
									activeTab === 'news'
										? 'border-primary text-primary'
										: 'border-transparent text-muted-foreground hover:text-foreground'
								}`}
							>
								News Management
							</button>
						</div>
					</div>
				)}
				
				<div className="px-6 py-4">
					{activeTab === 'profile' && <ProfileDetails user={user} />}
					{activeTab === 'users' && isAdmin && (
						<UserManagement 
							users={users || []} 
							makeAdmin={makeAdmin}
							deleteUser={deleteUser}
							updateUser={updateUser}
							currentUserId={user.id}
						/>
					)}
					{activeTab === 'news' && isAdmin && (
						<NewsManagement news={news || []} onUpdate={() => refetchNews()} />
					)}
				</div>
			</div>
		</div>
	)
}

function ProfileDetails({ user }: { user: any }) {
	return (
		<>
			<h2 className="text-lg font-semibold text-foreground mb-4">Account Details</h2>
			<div className="space-y-3">
				<div className="flex justify-between py-2 border-b border-border/50">
					<span className="text-muted-foreground">Email</span>
					<span className="text-foreground font-mono">{user.email}</span>
				</div>
				
				{user.name && (
					<div className="flex justify-between py-2 border-b border-border/50">
						<span className="text-muted-foreground">Name</span>
						<span className="text-foreground">{user.name}</span>
					</div>
				)}
				
				<div className="flex justify-between py-2 border-b border-border/50">
					<span className="text-muted-foreground">Role</span>
					<span className={`font-medium ${user.role === 'ADMIN' ? 'text-purple-500' : 'text-blue-500'}`}>
						{user.role}
					</span>
				</div>
				
				<div className="flex justify-between py-2 border-b border-border/50">
					<span className="text-muted-foreground">Member since</span>
					<span className="text-foreground">
						{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
					</span>
				</div>
				
				<div className="flex justify-between py-2">
					<span className="text-muted-foreground">User ID</span>
					<span className="text-foreground font-mono text-sm">{user.id?.slice(0, 8)}...</span>
				</div>
			</div>
		</>
	)
}

function UserManagement({ users, makeAdmin, deleteUser, updateUser, currentUserId }: any) {
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
	
	if (!users) return <div>Loading users...</div>
	
	return (
		<>
			<h2 className="text-lg font-semibold text-foreground mb-4">User Management</h2>
			
			{editingUser && (
				<div className="mb-4 p-4 bg-muted rounded-lg">
					<h3 className="font-medium mb-3">Edit User: {editingUser.email}</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<input
							type="text"
							placeholder="Name"
							value={editForm.name}
							onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
							className="px-3 py-2 bg-background border border-input rounded"
						/>
						<input
							type="email"
							placeholder="Email"
							value={editForm.email}
							onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
							className="px-3 py-2 bg-background border border-input rounded"
						/>
						<select
							value={editForm.role}
							onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
							className="px-3 py-2 bg-background border border-input rounded"
						>
							<option value="USER">User</option>
							<option value="ADMIN">Admin</option>
						</select>
					</div>
					<div className="flex gap-2 mt-3">
						<button
							onClick={handleUpdate}
							disabled={updateUser.isPending}
							className="px-3 py-1 bg-green-500 text-white rounded text-sm"
						>
							Save
						</button>
						<button
							onClick={() => setEditingUser(null)}
							className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
						>
							Cancel
						</button>
					</div>
				</div>
			)}
			
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-muted">
						<tr>
							<th className="px-4 py-3 text-left text-sm">Email</th>
							<th className="px-4 py-3 text-left text-sm">Name</th>
							<th className="px-4 py-3 text-left text-sm">Role</th>
							<th className="px-4 py-3 text-left text-sm">Created</th>
							<th className="px-4 py-3 text-left text-sm">Actions</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user: any) => (
							<tr key={user.id} className="border-t border-border">
								<td className="px-4 py-2 text-sm">{user.email}</td>
								<td className="px-4 py-2 text-sm">{user.name || '-'}</td>
								<td className="px-4 py-2 text-sm">
									<span className={`px-2 py-0.5 rounded text-xs ${
										user.role === 'ADMIN' 
											? 'bg-purple-500/20 text-purple-500' 
											: 'bg-blue-500/20 text-blue-500'
									}`}>
										{user.role}
									</span>
								</td>
								<td className="px-4 py-2 text-sm text-muted-foreground">
									{new Date(user.createdAt).toLocaleDateString()}
								</td>
								<td className="px-4 py-2">
									<div className="flex gap-2">
										<button
											onClick={() => handleEdit(user)}
											className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
										>
											Edit
										</button>
										
										{user.role !== 'ADMIN' && (
											<button
												onClick={() => makeAdmin.mutate({ id: user.id })}
												className="px-2 py-1 bg-purple-500 text-white rounded text-xs"
											>
												Make Admin
											</button>
										)}
										
										{user.id !== currentUserId && (
											<button
												onClick={() => {
													if (confirm(`Delete ${user.email}?`)) {
														deleteUser.mutate({ id: user.id })
													}
												}}
												className="px-2 py-1 bg-red-500 text-white rounded text-xs"
											>
												Delete
											</button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			
			<p className="text-xs text-muted-foreground mt-4">
				Total users: {users.length}
			</p>
		</>
	)
}

function NewsManagement({ news, onUpdate }: { news: any[], onUpdate: () => void }) {
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editingNews, setEditingNews] = useState<any>(null)
  
  const utils = trpc.useUtils()
  
  const createNews = trpc.news.create.useMutation({
    onSuccess: () => {
      utils.news.getAllAdmin.invalidate()
      onUpdate()
      setMode('list')
    },
    onError: (error) => alert(`Error: ${error.message}`)
  })
  
  const updateNews = trpc.news.update.useMutation({
    onSuccess: () => {
      utils.news.getAllAdmin.invalidate()
      onUpdate()
      setMode('list')
      setEditingNews(null)
    },
    onError: (error) => alert(`Error: ${error.message}`)
  })
  
  const deleteNews = trpc.news.delete.useMutation({
    onSuccess: () => {
      utils.news.getAllAdmin.invalidate()
      onUpdate()
    },
    onError: (error) => alert(`Error: ${error.message}`)
  })
  
  const handleSave = (data: { title: string; content: string; isPublished: boolean }) => {
    if (mode === 'create') {
      createNews.mutate(data)
    } else if (mode === 'edit' && editingNews) {
      updateNews.mutate({ id: editingNews.id, ...data })
    }
  }
  
  const handleEdit = (newsItem: any) => {
    setEditingNews(newsItem)
    setMode('edit')
  }
  
  const handleCancel = () => {
    setMode('list')
    setEditingNews(null)
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">News Management</h2>
        {mode === 'list' && (
          <button
            onClick={() => setMode('create')}
            className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
          >
            + Add News
          </button>
        )}
      </div>
      
      {mode === 'create' && (
        <NewsForm
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={createNews.isPending}
        />
      )}
      
      {mode === 'edit' && editingNews && (
        <NewsForm
          initialTitle={editingNews.title}
          initialContent={editingNews.content}
          initialPublished={editingNews.isPublished}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={updateNews.isPending}
        />
      )}
      
      {mode === 'list' && (
        <div className="space-y-3">
          {news?.map((item) => (
            <div key={item.id} className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <div 
                    className="text-sm text-muted-foreground line-clamp-2 mt-1"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Status: {item.isPublished ? '✅ Published' : '📝 Draft'}</span>
                    <span>Views: {item.views || 0}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this news?')) {
                        deleteNews.mutate({ id: item.id })
                      }
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {news?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No news yet. Create your first news!</p>
          )}
        </div>
      )}
    </div>
  )
}