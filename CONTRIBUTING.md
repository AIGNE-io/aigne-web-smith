# Contributing to AIGNE WebSmith

Thank you for your interest in AIGNE WebSmith! We welcome all forms of contributions including code, documentation, bug reports, and feature suggestions.

## 🚀 How to Contribute

### Reporting Issues

If you find a bug or have a feature suggestion, please:

1. **Search Existing Issues**: Make sure the issue hasn't been reported already
2. **Create a Detailed Issue**: Include reproduction steps, expected behavior, and actual behavior
3. **Provide Environment Info**: System version, Node.js version, relevant configurations
4. **Include Error Logs**: If applicable, provide complete error information

### Contributing Code

#### Setting up Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/yourusername/aigne-web-smith.git
cd aigne-web-smith

# Install dependencies
pnpm install

# Run tests to ensure everything works
bun test

# Start development environment
npm run lint
```

#### Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/issue-number
   ```

2. **Follow Code Standards**
   - Use Biome for code formatting
   - Follow existing code style
   - Add necessary JSDoc comments
   - Ensure test coverage for new features

3. **Write Tests**
   ```bash
   # Write tests for new features
   # Test files should go in appropriate tests/ subdirectories
   
   # Run tests to ensure they pass
   bun test
   
   # Run specific tests
   bun test tests/your-test-file.test.mjs
   ```

4. **Commit Changes**
   ```bash
   # Run code quality checks
   npm run lint:fix
   
   # Commit changes
   git add .
   git commit -m "feat: add new feature description"
   
   # or for bug fixes
   git commit -m "fix: resolve issue with specific problem"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Then create a Pull Request on GitHub.

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Code formatting changes (no functional impact)
- `refactor`: Code refactoring
- `test`: Test-related changes
- `chore`: Build process or auxiliary tool changes

**Examples**:
```
feat(agents): add new website structure evaluation agent

Add comprehensive SEO and UX evaluation capabilities
to the structure planning process.

Closes #123
```

## 🏗️ Architecture Guide

### Project Structure

```
aigne-web-smith/
├── agents/          # AI Agent definition files
├── prompts/         # AI prompt templates
├── utils/           # Utility functions
├── web-mcp/         # MCP server endpoints
├── tests/           # Test files
└── mock-inputs/     # Example input data
```

### Adding New Agents

1. **Create Agent File**: Create `.yaml` file in `agents/`
2. **Add Prompt**: Create corresponding `.md` file in `prompts/`
3. **Update Config**: Add agent to `aigne.yaml`
4. **Write Tests**: Add tests in `tests/agents/`
5. **Update Docs**: Update README.md and related documentation

### Adding Utility Functions

1. **Choose Appropriate Location**: 
   - General utilities → `utils/utils.mjs`
   - Pages Kit related → `utils/pages-kit-utils.mjs`
   - New tool category → create new file

2. **Write Function**:
   ```javascript
   /**
    * Function description
    * @param {type} param - Parameter description
    * @returns {type} Return value description
    */
   export function yourFunction(param) {
     // Implementation
   }
   ```

3. **Add Tests**:
   ```javascript
   describe("yourFunction", () => {
     test("should handle basic case", () => {
       expect(yourFunction("input")).toBe("expected");
     });
   });
   ```

## 🧪 Testing Guide

### Test Structure

```
tests/
├── utils/           # Utility function tests
├── agents/          # Agent functionality tests
└── README.md        # Testing documentation
```

### Writing Tests

1. **Unit Tests**: Test individual function behavior
2. **Integration Tests**: Test multiple component collaboration
3. **Error Handling**: Test edge cases and error conditions
4. **Performance Tests**: Performance validation for critical paths

### Testing Best Practices

- **Descriptive Naming**: Use clear test descriptions
- **Independence**: Each test should run independently
- **Completeness**: Test both normal and exceptional cases
- **Maintainability**: Avoid overly complex test logic

## 📝 Documentation Contributions

### Documentation Types

1. **API Documentation**: Function and Agent usage instructions
2. **User Guides**: Tutorials on how to use WebSmith
3. **Development Docs**: Architecture and development-related documentation
4. **Code Examples**: Practical code examples

### Documentation Standards

- Use clear, concise language
- Provide code examples
- Include error handling instructions
- Maintain format consistency

## 🔍 Code Review

### PR Review Points

1. **Functional Correctness**: Does the code implement expected functionality
2. **Test Coverage**: Are there appropriate tests for new features
3. **Performance Impact**: Do changes affect system performance
4. **Security Considerations**: Are there any security risks introduced
5. **Documentation Updates**: Does documentation need updating

### Review Process

1. **Automated Checks**: CI/CD pipeline automated checks
2. **Code Review**: Review by at least one maintainer
3. **Tests Pass**: All tests must pass
4. **Documentation Check**: Ensure documentation is up to date

## 🎯 Development Priorities

### Current Focus

1. **Core Feature Stability**: Ensure reliability of existing functionality
2. **Performance Optimization**: Improve website generation speed
3. **User Experience**: Improve CLI and error messages
4. **Documentation**: Provide more examples and tutorials

### Feature Roadmap

- [ ] More component support
- [ ] Multi-theme template system
- [ ] Visual editor integration
- [ ] Enhanced automated testing
- [ ] Extended internationalization support

## ❓ Getting Help

If you encounter issues while contributing, please:

1. **Check Documentation**: First check existing documentation
2. **Search Issues**: Look for similar problems
3. **Ask Questions**: Ask in GitHub Discussions
4. **Contact Maintainers**: Contact via Issues or email

## 📄 License

By contributing code, you agree that your contributions will be released under the MIT License.

---

Thank you for helping make AIGNE WebSmith better! 🚀