'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, Plus, Trash2, Users, FolderPlus, ChefHat } from 'lucide-react'
import { useConsole } from '@/components/console-provider'
import { usePortfolio } from '@/components/portfolio-store'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function ManagerConsolePage() {
  const router = useRouter()
  const {
    isLoggedIn,
    userRole,
    username,
    logout,
    projects,
    employees,
    handoverQueue,
    updateSousChef,
    canBeSousChef,
    createProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
    assignToProject,
    removeFromProject,
    completeHandover,
  } = useConsole()
  const { takeOwnership } = usePortfolio()

  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'sous-chefs' | 'team' | 'manage-projects' | 'handover'>(
    'dashboard'
  )
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [selectedSousChef, setSelectedSousChef] = useState<string>('')
  const [newTeamMemberName, setNewTeamMemberName] = useState('')
  const [newProjectName, setNewProjectName] = useState('')
  const [selectedProjectOwner, setSelectedProjectOwner] = useState('')
  const [selectedEmployeeForAssign, setSelectedEmployeeForAssign] = useState('')
  const [selectedProjectForAssign, setSelectedProjectForAssign] = useState('')
  const [handoverRecipients, setHandoverRecipients] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isLoggedIn || userRole !== 'manager') {
      router.push('/login')
    }
  }, [isLoggedIn, userRole, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleAssignSousChef = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedProject && selectedSousChef) {
      const selectedEmp = employees.find((e) => e.id === selectedSousChef)
      if (selectedEmp && canBeSousChef(selectedEmp.name, selectedProject)) {
        updateSousChef(selectedProject, selectedSousChef)
        setSelectedSousChef('')
        setSelectedProject('')
      }
    }
  }

  const handleRemoveSousChef = (projectId: string) => {
    updateSousChef(projectId, null)
  }

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTeamMemberName.trim()) {
      addTeamMember(newTeamMemberName)
      setNewTeamMemberName('')
    }
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (newProjectName.trim() && selectedProjectOwner) {
      createProject(newProjectName, selectedProjectOwner)
      setNewProjectName('')
      setSelectedProjectOwner('')
    }
  }

  const handleAssignToProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEmployeeForAssign && selectedProjectForAssign) {
      assignToProject(selectedEmployeeForAssign, selectedProjectForAssign)
      setSelectedEmployeeForAssign('')
      setSelectedProjectForAssign('')
    }
  }

  const getEmployeeName = (id: string) => employees.find((e) => e.id === id)?.name || id
  const getProjectName = (id: string) => projects.find((p) => p.id === id)?.name || id
  const getRecommendedRecipient = (projectId: string) => {
    const project = projects.find((item) => item.id === projectId)
    return employees.find((employee) => employee.name === project?.sous_chef)?.id ?? 'sarah'
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground">
              Manager Console
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{username}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/')}
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              <Home className="mr-2 size-4" />
              Home
            </button>
            <button
              onClick={handleLogout}
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {/* Tabs */}
          <div className="mb-8 flex flex-wrap gap-2 border-b border-border">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'projects', label: 'Projects' },
              { id: 'sous-chefs', label: 'Sous-Chefs' },
              { id: 'team', label: 'Team' },
              { id: 'manage-projects', label: 'Manage Projects' },
              { id: 'handover', label: 'Bread Basket' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as 'dashboard' | 'projects' | 'sous-chefs' | 'team' | 'manage-projects' | 'handover')
                }
                className={cn(
                  'px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-foreground'
                    : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Projects
                  </p>
                  <p className="mt-2 font-serif text-3xl font-semibold text-foreground">
                    {projects.length}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm font-medium text-muted-foreground">
                    Team Members
                  </p>
                  <p className="mt-2 font-serif text-3xl font-semibold text-foreground">
                    {employees.length}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Projects Overview
                </h2>
                <div className="mt-4 space-y-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Owner: {project.owner}
                          {project.sous_chef && ` • Sous-Chef: ${project.sous_chef}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Owner: <span className="font-medium text-foreground">{project.owner}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Sous-Chef
                      </p>
                      <div className="mt-2">
                        {project.sous_chef ? (
                          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3">
                                <p className="flex items-center gap-1.5 text-sm text-foreground">
                                  <ChefHat className="size-3.5 text-amber-500" aria-hidden />
                                  {project.sous_chef}
                                </p>
                            <button
                              onClick={() => handleRemoveSousChef(project.id)}
                              className={cn(
                                buttonVariants({ variant: 'outline', size: 'sm' })
                              )}
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No sous-chef assigned
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground">
                        Team Members ({project.teamMembers.length})
                      </p>
                      <div className="mt-2 space-y-2">
                        {project.teamMembers.length > 0 ? (
                          project.teamMembers.map((memberId) => (
                            <div key={memberId} className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3">
                              <p className="text-sm text-foreground">
                                {getEmployeeName(memberId)}
                              </p>
                              <button
                                onClick={() => removeFromProject(memberId, project.id)}
                                className={cn(
                                  buttonVariants({ variant: 'outline', size: 'sm' })
                                )}
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No team members assigned
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sous-Chefs Tab */}
          {activeTab === 'sous-chefs' && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Assign Sous-Chefs to Projects
              </h2>
              
              <form onSubmit={handleAssignSousChef} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Select Team Member
                  </label>
                  <select
                    value={selectedSousChef}
                    onChange={(e) => setSelectedSousChef(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Choose...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Select Project
                  </label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Choose...</option>
                    {projects.map((proj) => {
                      const selectedEmp = employees.find(
                        (e) => e.id === selectedSousChef
                      )
                      const canAssign =
                        !selectedEmp || canBeSousChef(selectedEmp.name, proj.id)
                      return (
                        <option
                          key={proj.id}
                          value={proj.id}
                          disabled={!canAssign}
                        >
                          {proj.name}
                          {!canAssign && ' (Cannot be assigned - is owner)'}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={
                    !selectedProject ||
                    !selectedSousChef ||
                    !canBeSousChef(
                      employees.find((e) => e.id === selectedSousChef)?.name || '',
                      selectedProject
                    )
                  }
                  className={cn(
                    buttonVariants({ variant: 'default' }),
                    'w-full disabled:opacity-50'
                  )}
                >
                  <Plus className="mr-2 size-4" />
                  Assign Sous-Chef
                </button>
              </form>
            </div>
          )}

          {/* Team Management Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Add New Team Member
                </h2>

                <form onSubmit={handleAddTeamMember} className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Team Member Name
                    </label>
                    <input
                      type="text"
                      value={newTeamMemberName}
                      onChange={(e) => setNewTeamMemberName(e.target.value)}
                      placeholder="Enter name"
                      className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className={cn(
                      buttonVariants({ variant: 'default' }),
                      'w-full'
                    )}
                  >
                    <Plus className="mr-2 size-4" />
                    Add Team Member
                  </button>
                </form>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Current Team Members ({employees.length})
                </h2>

                <div className="mt-6 space-y-2">
                  {employees.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4"
                    >
                      <div>
                        <p className="font-medium text-foreground">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {emp.projects.length} project(s)
                        </p>
                      </div>
                      <button
                        onClick={() => removeTeamMember(emp.id)}
                        className={cn(
                          buttonVariants({ variant: 'destructive', size: 'sm' })
                        )}
                      >
                        <Trash2 className="mr-2 size-3" />
                        Kick
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Manage Projects Tab */}
          {activeTab === 'manage-projects' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Create New Project
                </h2>

                <form onSubmit={handleCreateProject} className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Project Owner
                    </label>
                    <select
                      value={selectedProjectOwner}
                      onChange={(e) => setSelectedProjectOwner(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Choose...</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className={cn(
                      buttonVariants({ variant: 'default' }),
                      'w-full'
                    )}
                  >
                    <FolderPlus className="mr-2 size-4" />
                    Create Project
                  </button>
                </form>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Assign Team Members to Projects
                </h2>

                <form onSubmit={handleAssignToProject} className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Select Team Member
                    </label>
                    <select
                      value={selectedEmployeeForAssign}
                      onChange={(e) => setSelectedEmployeeForAssign(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Choose...</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">
                      Select Project
                    </label>
                    <select
                      value={selectedProjectForAssign}
                      onChange={(e) => setSelectedProjectForAssign(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Choose...</option>
                      {projects.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedEmployeeForAssign || !selectedProjectForAssign}
                    className={cn(
                      buttonVariants({ variant: 'default' }),
                      'w-full disabled:opacity-50'
                    )}
                  >
                    <Plus className="mr-2 size-4" />
                    Assign to Project
                  </button>
                </form>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Delete Projects
                </h2>

                <div className="mt-6 space-y-2">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4"
                    >
                      <div>
                        <p className="font-medium text-foreground">{proj.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Owner: {proj.owner}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className={cn(
                          buttonVariants({ variant: 'destructive', size: 'sm' })
                        )}
                      >
                        <Trash2 className="mr-2 size-3" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bread Basket Tab */}
          {activeTab === 'handover' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  Bread Basket ({handoverQueue.length})
                </h2>

                <div className="mt-6 space-y-3">
                  {handoverQueue.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No pending handovers</p>
                  ) : (
                    handoverQueue.map((handover) => (
                      <div
                        key={handover.id}
                        className={cn(
                          'rounded-lg border p-4',
                          handover.status === 'completed'
                            ? 'border-border/50 bg-secondary/30'
                            : 'border-yellow-200 bg-yellow-50'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">
                              {getEmployeeName(handover.fromEmployeeId)} →{' '}
                              {handover.status === 'pending'
                                ? 'Choose recipient'
                                : getEmployeeName(handover.toEmployeeId)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Project: {getProjectName(handover.projectId)}
                            </p>
                            <p className={cn(
                              'text-xs font-semibold uppercase mt-1',
                              handover.status === 'pending' ? 'text-yellow-600' : 'text-green-600'
                            )}>
                              {handover.status}
                            </p>
                          </div>
                          {handover.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <label className="sr-only" htmlFor={`recipient-${handover.id}`}>
                                Choose recipient
                              </label>
                              <select
                                id={`recipient-${handover.id}`}
                                value={
                                  handoverRecipients[handover.id] ??
                                  getRecommendedRecipient(handover.projectId)
                                }
                                onChange={(event) =>
                                  setHandoverRecipients((current) => ({
                                    ...current,
                                    [handover.id]: event.target.value,
                                  }))
                                }
                                className="h-9 rounded-lg border border-border bg-background px-2 text-sm text-foreground"
                              >
                                {employees
                                  .filter((employee) => employee.id !== handover.fromEmployeeId)
                                  .map((employee) => (
                                    <option key={employee.id} value={employee.id}>
                                      {employee.name}
                                      {employee.id === getRecommendedRecipient(handover.projectId)
                                        ? ' (recommended)'
                                        : ''}
                                    </option>
                                  ))}
                              </select>
                              <button
                                onClick={() => {
                                  const recipientId =
                                    handoverRecipients[handover.id] ??
                                    getRecommendedRecipient(handover.projectId)
                                  const recipientName = getEmployeeName(recipientId)
                                  completeHandover(handover.id, recipientId)
                                  takeOwnership(handover.projectId, recipientName)
                                }}
                                className={cn(
                                  buttonVariants({ variant: 'default', size: 'sm' })
                                )}
                              >
                                Complete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

