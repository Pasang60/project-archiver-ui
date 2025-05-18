import { Component } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent {


  faqs = [
    {
      question: "What is Project Archiver?",
      answer: "Project Archiver is a project management and collaboration tool that helps teams and individuals plan, organize, track, and store their projects and tasks efficiently in one centralized platform."
    },
    {
      question: "Who should use Project Archiver?",
      answer: "Project Archiver is ideal for freelancers, teams, startups, and enterprises that need a reliable system to manage tasks, documents, timelines, and collaboration across multiple projects."
    },
    {
      question: "What features does Project Archiver offer?",
      answer: "Project Archiver includes task management, document storage, version control, team messaging, real-time updates, calendar integrations, custom workflows, and analytics dashboards."
    },
    {
      question: "Is there a mobile app for Project Archiver?",
      answer: "No, Project Archiver currently offers web apps for both iOS and Android, allowing you to manage your tasks, track progress, and collaborate on the go."
    },
    {
      question: "How secure is my data on Project Archiver?",
      answer: "Your data is protected with end-to-end encryption, secure cloud hosting, regular backups, and role-based access controls to ensure privacy and security."
    },
    {
      question: "Is there customer support available?",
      answer: "Yes, Project Archiver offers 24/7 customer support via email and chat. A knowledge base and video tutorials are also available to help you get started."
    },
    {
      question: "What pricing plans are available?",
      answer: "Project Archiver offers a free tier with basic features, as well as premium and enterprise plans that include advanced tools, integrations, and support options."
    }
  ];


}
