'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

// Hardcoded credentials for testing
const MANAGER_CREDS = { username: 'manager', password: 'manager123' }
const SARAH_CREDS = {
  username: 'sarah',
  password: 'sarah123',
  employeeId: 'sarah',
  displayName: 'Sarah Patel',
}

export type UserRole = 'manager' | 'employee' | null

export type Employee = {
  id: string
  name: string
  role: 'owner' | 'sous_chef' | 'team_member'
  projects: string[] // Project IDs assigned to this employee
}

export type Project = {
  id: string
  name: string
  owner: string
  sous_chef: string | null
  teamMembers: string[] // Employee IDs assigned to this project
}

export type HandoverItem = {
  id: string
  fromEmployeeId: string
  toEmployeeId: string
  projectId: string
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  createdAt: Date
}

export type NotificationSeverity = 'info' | 'warning' | 'critical'

export type Notification = {
  id: string
  audience: 'manager' | 'employee'
  recipientId?: string
  title: string
  description: string
  timestamp: Date
  severity: NotificationSeverity
  actionLabel?: string
  actionHref?: string
  read?: boolean
  kind?: 'alert' | 'recommendation'
  relatedHandoverId?: string
}

export type MeetingStatus = 'scheduled' | 'completed' | 'recording-available'

export type Meeting = {
  id: string
  projectId: string
  previousOwner: string
  newOwner: string
  scheduledDate: string
  scheduledTime: string
  notes: string
  status: MeetingStatus
  recordingUrl?: string
}

export type ConsoleContextType = {
  // Auth
  isLoggedIn: boolean
  userRole: UserRole
  username: string | null
  displayName: string | null
  employeeId: string | null
  login: (username: string, password: string) => boolean
  logout: () => void

  // Data
  projects: Project[]
  employees: Employee[]
  handoverQueue: HandoverItem[]
  notifications: Notification[]
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
  dismissNotification: (notificationId: string) => void
  respondToRecommendation: (handoverId: string, accepted: boolean) => void
  meetings: Meeting[]
  scheduleMeeting: (meeting: Omit<Meeting, 'id' | 'status'>) => void
  completeMeeting: (meetingId: string) => void
  addMeetingRecording: (meetingId: string, recordingUrl: string) => void
  askQuestion: (projectId: string, question: string) => void

  // Manager actions - Projects
  createProject: (name: string, ownerId: string) => void
  deleteProject: (projectId: string) => void
  updateSousChef: (projectId: string, sousChefId: string | null) => void
  canBeSousChef: (personName: string, projectId: string) => boolean

  // Manager actions - Team
  addTeamMember: (name: string) => void
  removeTeamMember: (employeeId: string) => void
  assignToProject: (employeeId: string, projectId: string) => void
  removeFromProject: (employeeId: string, projectId: string) => void

  // Manager actions - Handover
  createHandover: (fromEmployeeId: string, toEmployeeId: string, projectId: string) => void
  completeHandover: (handoverId: string, recipientId?: string) => void
  transferProjectOwnership: (projectId: string, newOwnerName: string) => void
  logCompletedHandover: (fromEmployeeId: string, toEmployeeId: string, projectId: string) => void
}

const ConsoleContext = createContext<ConsoleContextType | undefined>(undefined)

export function ConsoleProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [employeeId, setEmployeeId] = useState<string | null>(null)

  // Real data from portfolio-bakery
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'alex', name: 'Alex Chen', role: 'owner', projects: ['momentum-alpha', 'mean-reversion', 'overnight-gap'] },
    { id: 'sarah', name: 'Sarah Patel', role: 'owner', projects: ['volatility-filter'] },
    { id: 'daniel', name: 'Daniel Kim', role: 'owner', projects: ['liquidity-signal'] },
  ])

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'momentum-alpha',
      name: 'Momentum Alpha',
      owner: 'Alex Chen',
      sous_chef: 'Sarah Patel',
      teamMembers: ['daniel'],
    },
    {
      id: 'mean-reversion',
      name: 'Mean Reversion Strategy',
      owner: 'Alex Chen',
      sous_chef: 'Daniel Kim',
      teamMembers: ['sarah'],
    },
    {
      id: 'overnight-gap',
      name: 'Overnight Gap Reversal',
      owner: 'Alex Chen',
      sous_chef: null,
      teamMembers: [],
    },
    {
      id: 'volatility-filter',
      name: 'Volatility Filter',
      owner: 'Sarah Patel',
      sous_chef: 'Daniel Kim',
      teamMembers: ['alex'],
    },
    {
      id: 'liquidity-signal',
      name: 'Liquidity Signal',
      owner: 'Daniel Kim',
      sous_chef: 'Sarah Patel',
      teamMembers: [],
    },
  ])

  const [handoverQueue, setHandoverQueue] = useState<HandoverItem[]>(() =>
    projects
      .filter((project) => project.owner === 'Alex Chen')
      .map((project, index) => ({
        id: `initial-handover-${index + 1}`,
        fromEmployeeId: 'alex',
        toEmployeeId: '',
        projectId: project.id,
        status: 'pending' as const,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      })),
  )
        const [readNotificationIds, setReadNotificationIds] = useState<string[]>([])
        const [dismissedNotificationIds, setDismissedNotificationIds] = useState<string[]>([])
        const [userQuestions, setUserQuestions] = useState<Notification[]>([])
        const [meetings, setMeetings] = useState<Meeting[]>([
          {
            id: 'meeting-momentum-alpha-1',
            projectId: 'momentum-alpha',
            previousOwner: 'Alex Chen',
            newOwner: 'Sarah Patel',
            scheduledDate: '2026-08-20',
            scheduledTime: '10:00',
            notes: 'Walk through signal construction, volatility filtering, and known limitations.',
            status: 'recording-available',
            recordingUrl: 'https://example.com/recordings/momentum-alpha',
          },
        ])

  const login = (inputUsername: string, password: string): boolean => {
    if (
      inputUsername === MANAGER_CREDS.username &&
      password === MANAGER_CREDS.password
    ) {
      setIsLoggedIn(true)
      setUserRole('manager')
      setUsername(inputUsername)
      setDisplayName('Manager')
      setEmployeeId(null)
      return true
    } else if (
      inputUsername === SARAH_CREDS.username &&
      password === SARAH_CREDS.password
    ) {
      setIsLoggedIn(true)
      setUserRole('employee')
      setUsername(inputUsername)
      setDisplayName(SARAH_CREDS.displayName)
      setEmployeeId(SARAH_CREDS.employeeId)
      return true
    }
    return false
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserRole(null)
    setUsername(null)
    setDisplayName(null)
    setEmployeeId(null)
  }

  const updateSousChef = (projectId: string, sousChefId: string | null) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
            ...p,
            sous_chef: sousChefId
              ? employees.find((e) => e.id === sousChefId)?.name || null
              : null,
          }
          : p
      )
    )
  }

  const createProject = (name: string, ownerId: string) => {
    const owner = employees.find((e) => e.id === ownerId)
    if (!owner) return

    const newProjectId = name.toLowerCase().replace(/\s+/g, '-')
    const newProject: Project = {
      id: newProjectId,
      name,
      owner: owner.name,
      sous_chef: null,
      teamMembers: [],
    }

    setProjects((prev) => [...prev, newProject])

    // Add project to owner's projects list
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === ownerId
          ? { ...e, projects: [...e.projects, newProjectId] }
          : e
      )
    )
  }

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId))

    // Remove project from all employees
    setEmployees((prev) =>
      prev.map((e) => ({
        ...e,
        projects: e.projects.filter((p) => p !== projectId),
      }))
    )
  }

  const addTeamMember = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-')

    // Check if already exists
    if (employees.find((e) => e.id === id)) return

    const newMember: Employee = {
      id,
      name,
      role: 'team_member',
      projects: [],
    }

    setEmployees((prev) => [...prev, newMember])
  }

  const removeTeamMember = (employeeId: string) => {
    // Remove from all projects
    setProjects((prev) =>
      prev.map((p) => ({
        ...p,
        teamMembers: p.teamMembers.filter((id) => id !== employeeId),
        sous_chef: p.sous_chef === employees.find((e) => e.id === employeeId)?.name ? null : p.sous_chef,
      }))
    )

    // Remove from employees list
    setEmployees((prev) => prev.filter((e) => e.id !== employeeId))
  }

  const assignToProject = (employeeId: string, projectId: string) => {
    const employee = employees.find((e) => e.id === employeeId)
    if (!employee) return

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
            ...p,
            teamMembers: p.teamMembers.includes(employeeId)
              ? p.teamMembers
              : [...p.teamMembers, employeeId],
          }
          : p
      )
    )

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId
          ? {
            ...e,
            projects: e.projects.includes(projectId)
              ? e.projects
              : [...e.projects, projectId],
          }
          : e
      )
    )
  }

  const removeFromProject = (employeeId: string, projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
            ...p,
            teamMembers: p.teamMembers.filter((id) => id !== employeeId),
          }
          : p
      )
    )

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === employeeId
          ? {
            ...e,
            projects: e.projects.filter((p) => p !== projectId),
          }
          : e
      )
    )
  }

  const createHandover = (fromEmployeeId: string, toEmployeeId: string, projectId: string) => {
    const project = projects.find((p) => p.id === projectId)
    const fromEmployee = employees.find((e) => e.id === fromEmployeeId)

    if (
      !project ||
      !fromEmployee ||
      project.owner !== fromEmployee.name ||
      fromEmployeeId === toEmployeeId ||
      handoverQueue.some(
        (handover) => handover.projectId === projectId && handover.status === 'pending',
      )
    ) {
      return
    }

    const newHandover: HandoverItem = {
      id: Date.now().toString(),
      fromEmployeeId,
      toEmployeeId,
      projectId,
      status: 'pending',
      createdAt: new Date(),
    }

    setHandoverQueue((prev) => [...prev, newHandover])
  }

  const completeHandover = (handoverId: string, recipientId?: string) => {
    const handover = handoverQueue.find((h) => h.id === handoverId)
    if (!handover) return

    const toEmployee = employees.find(
      (e) => e.id === (recipientId ?? handover.toEmployeeId),
    )
    if (toEmployee) {
      transferProjectOwnership(handover.projectId, toEmployee.name)
    }

    setHandoverQueue((prev) =>
      prev.map((h) =>
        h.id === handoverId
          ? {
              ...h,
              toEmployeeId: recipientId ?? h.toEmployeeId,
              status: 'completed',
            }
          : h
      )
    )
  }

  const transferProjectOwnership = (projectId: string, newOwnerName: string) => {
    const newOwner = employees.find((e) => e.name === newOwnerName)
    const previousOwnerName = projects.find((p) => p.id === projectId)?.owner
    const previousOwner = employees.find((e) => e.name === previousOwnerName)

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              owner: newOwnerName,
              sous_chef: p.sous_chef === newOwnerName ? null : p.sous_chef,
              teamMembers: newOwner
                ? p.teamMembers.filter((id) => id !== newOwner.id)
                : p.teamMembers,
            }
          : p,
      ),
    )

    setEmployees((prev) =>
      prev.map((e) => {
        if (previousOwner && e.id === previousOwner.id) {
          return { ...e, projects: e.projects.filter((id) => id !== projectId) }
        }
        if (newOwner && e.id === newOwner.id) {
          return {
            ...e,
            projects: e.projects.includes(projectId)
              ? e.projects
              : [...e.projects, projectId],
          }
        }
        return e
      }),
    )
  }

  const logCompletedHandover = (
    fromEmployeeId: string,
    toEmployeeId: string,
    projectId: string,
  ) => {
    setHandoverQueue((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        fromEmployeeId,
        toEmployeeId,
        projectId,
        status: 'completed',
        createdAt: new Date(),
      },
    ])
  }

  const notifications = useMemo(() => {
    const derived: Notification[] = []

    handoverQueue.forEach((handover) => {
      if (handover.status !== 'pending') return
      const project = projects.find((item) => item.id === handover.projectId)
      if (!project) return

      const ageInDays = Math.floor(
        (Date.now() - handover.createdAt.getTime()) / (24 * 60 * 60 * 1000),
      )
      const recommendation = [...employees]
        .filter((employee) => employee.name !== project.owner)
        .sort((left, right) => {
          const relationshipScore = (employee: Employee) =>
            employee.name === project.sous_chef
              ? 0
              : project.teamMembers.includes(employee.id)
                ? 1
                : 2
          const workloadScore = (employee: Employee) =>
            projects.filter((item) => item.owner === employee.name).length
          return (
            relationshipScore(left) - relationshipScore(right) ||
            workloadScore(left) - workloadScore(right)
          )
        })[0]
      const escalation = ageInDays >= 7
        ? {
            title: `${project.name} is in Limbo`,
            description: `No handover has been completed after ${ageInDays} days. Assign an owner immediately.`,
            severity: 'critical' as const,
          }
        : ageInDays >= 4
          ? {
              title: `${project.name} is nearing Limbo`,
              description: `This handover has been unattended for ${ageInDays} days.`,
              severity: 'critical' as const,
            }
          : ageInDays >= 2
            ? {
                title: `${project.name} is unattended`,
                description: `This handover has been waiting for ${ageInDays} days.`,
                severity: 'warning' as const,
              }
            : {
                title: `${project.name} needs a handover`,
                description: 'Choose a new owner in the Bread Basket.',
                severity: 'info' as const,
              }

      derived.push({
        id: `handover-${handover.id}-${ageInDays}`,
        audience: 'manager',
        title: escalation.title,
        description: escalation.description,
        timestamp: handover.createdAt,
        severity: escalation.severity,
        actionLabel: 'Open Bread Basket',
        actionHref: '/handover',
        kind: 'alert',
      })

      if (!meetings.some((meeting) => meeting.projectId === project.id)) {
        derived.push({
          id: `meeting-missing-${handover.id}`,
          audience: 'manager',
          title: `${project.name} has no walkthrough scheduled`,
          description: 'Schedule time with the previous owner before completing the handover.',
          timestamp: handover.createdAt,
          severity: 'warning',
          actionLabel: 'Schedule meeting',
          actionHref: '/handover',
          kind: 'alert',
        })
      }

      if (!handover.toEmployeeId && recommendation) {
        derived.push({
          id: `recommendation-manager-${handover.id}`,
          audience: 'manager',
          title: `${recommendation.name} is recommended`,
          description:
            recommendation.name === project.sous_chef
              ? `${recommendation.name} previously supported ${project.name} as its sous-chef.`
              : `${recommendation.name} has the closest team relationship and current workload for ${project.name}.`,
          timestamp: handover.createdAt,
          severity: 'info',
          actionLabel: 'Review recommendation',
          actionHref: '/handover',
          kind: 'recommendation',
          relatedHandoverId: handover.id,
        })
        derived.push({
          id: `recommendation-employee-${handover.id}`,
          audience: 'employee',
          recipientId: recommendation.id,
          title: `You are recommended for ${project.name}`,
          description:
            recommendation.name === project.sous_chef
              ? 'You previously supported this project as its sous-chef.'
              : 'You have the closest team relationship and current workload for this project.',
          timestamp: handover.createdAt,
          severity: 'info',
          actionLabel: 'Review project',
          actionHref: `/recipe/${project.id}`,
          kind: 'recommendation',
          relatedHandoverId: handover.id,
        })
      }
    })

    meetings.forEach((meeting) => {
      const project = projects.find((item) => item.id === meeting.projectId)
      if (!project) return

      if (meeting.status === 'scheduled') {
        derived.push({
          id: `meeting-scheduled-${meeting.id}`,
          audience: 'manager',
          title: 'Algorithm walkthrough scheduled',
          description: `${meeting.previousOwner} will explain ${project.name} to ${meeting.newOwner} on ${meeting.scheduledDate} at ${meeting.scheduledTime}.`,
          timestamp: new Date(`${meeting.scheduledDate}T${meeting.scheduledTime}`),
          severity: 'info',
          actionLabel: 'Open Bread Basket',
          actionHref: '/handover',
          kind: 'alert',
        })
        const meetingTime = new Date(`${meeting.scheduledDate}T${meeting.scheduledTime}`).getTime()
        if (meetingTime - Date.now() <= 24 * 60 * 60 * 1000 && meetingTime >= Date.now()) {
          derived.push({
            id: `meeting-reminder-${meeting.id}`,
            audience: 'manager',
            title: `Walkthrough reminder: ${project.name}`,
            description: `${meeting.previousOwner} and ${meeting.newOwner} meet on ${meeting.scheduledDate} at ${meeting.scheduledTime}.`,
            timestamp: new Date(meetingTime),
            severity: 'warning',
            actionLabel: 'Open Bread Basket',
            actionHref: '/handover',
            kind: 'alert',
          })
        }
      }

      if (meeting.status === 'completed' || meeting.status === 'recording-available') {
        derived.push({
          id: `meeting-completed-${meeting.id}`,
          audience: 'manager',
          title: 'Algorithm walkthrough completed',
          description: `${meeting.previousOwner} completed the ${project.name} explanation.`,
          timestamp: new Date(`${meeting.scheduledDate}T${meeting.scheduledTime}`),
          severity: 'info',
          actionLabel: 'View project',
          actionHref: `/recipe/${project.id}`,
          kind: 'alert',
        })
      }

      if (meeting.status === 'recording-available' && meeting.recordingUrl) {
        derived.push({
          id: `meeting-recording-${meeting.id}`,
          audience: 'manager',
          title: 'Meeting recording available',
          description: `The ${project.name} walkthrough with ${meeting.previousOwner} is ready to view.`,
          timestamp: new Date(`${meeting.scheduledDate}T${meeting.scheduledTime}`),
          severity: 'info',
          actionLabel: 'View recording',
          actionHref: meeting.recordingUrl,
          kind: 'alert',
        })
      }
    })

    return [...derived, ...userQuestions].filter(
      (notification) => !dismissedNotificationIds.includes(notification.id),
    )
  }, [dismissedNotificationIds, employees, handoverQueue, meetings, projects, userQuestions])

  const markNotificationRead = (notificationId: string) => {
    setReadNotificationIds((current) =>
      current.includes(notificationId) ? current : [...current, notificationId],
    )
  }

  const markAllNotificationsRead = () => {
    setReadNotificationIds(notifications.map((notification) => notification.id))
  }

  const dismissNotification = (notificationId: string) => {
    setDismissedNotificationIds((current) =>
      current.includes(notificationId) ? current : [...current, notificationId],
    )
  }

  const askQuestion = (projectId: string, question: string) => {
    const trimmed = question.trim()
    if (!trimmed) return
    const project = projects.find((item) => item.id === projectId)
    if (!project) return
    const timestamp = Date.now()
    const newNotifications: Notification[] = [
      {
        id: `question-${projectId}-${timestamp}-mgr`,
        audience: 'manager',
        title: `New question on ${project.name}`,
        description: trimmed,
        timestamp: new Date(),
        severity: 'info',
        actionLabel: 'View recipe',
        actionHref: `/recipe/${projectId}`,
        kind: 'alert',
      },
    ]
    if (project.sous_chef) {
      const sousChef = employees.find((employee) => employee.name === project.sous_chef)
      if (sousChef) {
        newNotifications.push({
          id: `question-${projectId}-${timestamp}-sous`,
          audience: 'employee',
          recipientId: sousChef.id,
          title: `Question on ${project.name}`,
          description: trimmed,
          timestamp: new Date(),
          severity: 'info',
          actionLabel: 'View recipe',
          actionHref: `/recipe/${projectId}`,
          kind: 'alert',
        })
      }
    }
    setUserQuestions((current) => [...newNotifications, ...current])
  }

  const respondToRecommendation = (handoverId: string, accepted: boolean) => {
    const handover = handoverQueue.find((item) => item.id === handoverId)
    if (!handover || handover.status !== 'pending') return

    const project = projects.find((item) => item.id === handover.projectId)
    const recommendedEmployee = project
      ? employees.find((employee) => employee.name === project.sous_chef)
      : undefined
    if (!project || !recommendedEmployee) return

    if (accepted) {
      transferProjectOwnership(project.id, recommendedEmployee.name)
    }

    setHandoverQueue((current) =>
      current.map((item) =>
        item.id === handoverId
          ? {
              ...item,
              toEmployeeId: recommendedEmployee.id,
              status: accepted ? 'completed' : 'declined',
            }
          : item,
      ),
    )
  }

  const scheduleMeeting = (meeting: Omit<Meeting, 'id' | 'status'>) => {
    setMeetings((current) => [
      ...current,
      { ...meeting, id: `meeting-${Date.now()}`, status: 'scheduled' },
    ])
  }

  const completeMeeting = (meetingId: string) => {
    setMeetings((current) =>
      current.map((meeting) =>
        meeting.id === meetingId ? { ...meeting, status: 'completed' } : meeting,
      ),
    )
  }

  const addMeetingRecording = (meetingId: string, recordingUrl: string) => {
    setMeetings((current) =>
      current.map((meeting) =>
        meeting.id === meetingId
          ? { ...meeting, recordingUrl, status: 'recording-available' }
          : meeting,
      ),
    )
  }

  const canBeSousChef = (personName: string, projectId: string): boolean => {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return false
    // Cannot be sous-chef if already the owner of this project
    return project.owner !== personName
  }

  return (
    <ConsoleContext.Provider
      value={{
        isLoggedIn,
        userRole,
        username,
        displayName,
        employeeId,
        login,
        logout,
        projects,
        employees,
        handoverQueue,
        notifications: notifications.map((notification) => ({
          ...notification,
          read: readNotificationIds.includes(notification.id),
        })),
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
        respondToRecommendation,
        meetings,
        scheduleMeeting,
        completeMeeting,
        addMeetingRecording,
        askQuestion,
        updateSousChef,
        canBeSousChef,
        createProject,
        deleteProject,
        addTeamMember,
        removeTeamMember,
        assignToProject,
        removeFromProject,
        createHandover,
        completeHandover,
        transferProjectOwnership,
        logCompletedHandover,
      }}
    >
      {children}
    </ConsoleContext.Provider>
  )
}

export const useConsole = () => {
  const context = useContext(ConsoleContext)
  if (!context) {
    throw new Error('useConsole must be used within ConsoleProvider')
  }
  return context
}
