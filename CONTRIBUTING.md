# 🤝 Contributing to LLM Key Manager

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

---

## 📋 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Assume good intentions
- Report misconduct to maintainers

---

## 🚀 How to Contribute

### Report Bugs
1. Check existing issues first
2. Provide detailed reproduction steps
3. Include system information (Go version, Node version, Windows version)
4. Attach error logs if available

### Suggest Features
1. Open an issue with label `enhancement`
2. Describe the feature and use case
3. Provide mockups or examples if relevant
4. Discuss implementation approach

### Submit Code Changes
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes following our style guide
4. Test your changes thoroughly
5. Commit with clear messages: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open Pull Request with description

---

## 🏗️ Development Setup

### Prerequisites
- Go 1.21+
- Node.js 18+
- Git

### Local Development

```bash
# Clone your fork
git clone https://github.com/your-username/llm-key-manager.git
cd llm-key-manager

# Install dependencies
go mod download
cd frontend && npm install && cd ..

# Run development server
wails dev
```

---

## 📝 Coding Standards

### Go Code
- Follow Go conventions (gofmt, golint)
- Use meaningful variable names
- Add comments for exported functions
- Keep functions small and focused
- Handle errors explicitly

### React/TypeScript
- Use functional components with hooks
- Use TypeScript for type safety
- Follow React best practices
- Meaningful component names
- Props documentation

### Naming Conventions
- Components: PascalCase (MyComponent.tsx)
- Functions: camelCase (myFunction)
- Constants: UPPER_SNAKE_CASE (MAX_SIZE)
- Files: kebab-case (my-component.tsx)

### Comments
- Explain WHY, not WHAT
- Keep comments up-to-date
- Use JSDoc for functions

---

## 🧪 Testing

- Test your changes locally before submitting
- Add tests for new features
- Ensure existing tests pass
- Test on Windows 10/11

---

## 📦 Commit Messages

```
Add: New feature description
Fix: Bug fix description
Refactor: Code refactoring description
Docs: Documentation update
Style: Code style changes (no functional change)
```

Examples:
- `Add: Multi-user support`
- `Fix: Auto-lock timeout not working`
- `Refactor: Simplify key search logic`

---

## 🔄 Pull Request Process

1. **Title**: Clear description of changes
2. **Description**: Explain what, why, and how
3. **Testing**: Describe how you tested
4. **Screenshots**: For UI changes (if available)
5. **Issues**: Reference related issues (#123)

### PR Template
```
## Description
Brief description of changes

## Related Issues
Fixes #123
Related to #456

## Testing
How did you test this?

## Checklist
- [ ] Tested locally
- [ ] No breaking changes
- [ ] Documentation updated
- [ ] Comments added where needed
```

---

## 🎯 Areas for Contribution

### Backend (Go)
- [ ] Performance optimizations
- [ ] Error handling improvements
- [ ] New encryption features
- [ ] Security enhancements

### Frontend (React)
- [ ] New components
- [ ] UI improvements
- [ ] Animation enhancements
- [ ] Accessibility improvements

### Documentation
- [ ] README improvements
- [ ] Code comments
- [ ] Tutorial guides
- [ ] FAQ section

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Bug reports

---

## 📚 Resources

- [Go Documentation](https://golang.org/doc/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Wails Documentation](https://wails.io/docs/)

---

## ❓ Questions?

- Check GitHub Issues and Discussions
- Open a discussion for questions
- Email maintainers for security issues

---

## ✨ Recognition

Contributors will be recognized in:
- README.md
- GitHub contributors page
- Release notes

Thank you for contributing! 🙏
