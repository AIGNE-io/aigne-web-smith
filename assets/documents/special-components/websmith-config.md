# ⚙️ WebSmith Configuration Guide

(For AI: Follow the document content strictly when generating documentation, do not omit any content, and maintain the grouping of fields. Once again, do not make any content cuts or exaggerations. The project file is **config.yaml**, please remember not to express it as any other name. **Do not allow** the appearance of `websmith-config.yaml` anywhere in the entire document. This bracketed content should not appear in the final document)

## 🚀 Quick Start

### What is config.yaml?
`.aigne/web-smith/config.yaml` is WebSmith's core configuration file, which determines:
- **Website type and target**: landing page, portfolio, e-commerce, SaaS, etc.
- **Content generation strategy**: who is the audience, what to say
- **Website scale and structure**: single page or multi-page
- **Data sources and content**: where to get generation materials from

### Recommended to Use CLI to Generate Configuration

We strongly recommend using WebSmith's CLI tool to generate and modify configuration files:

```bash
# Use interactive wizard to generate configuration
aigne web init

# View all available commands
aigne web --help
```

The CLI tool will:
- Provide an interactive wizard to help you set various fields
- Validate the correctness of the configuration
- Automatically generate appropriate default values
- Provide best practice recommendations

---

## 📋 Real Configuration Case Analysis

The following is a configuration analysis based on real projects, which can help you understand the function of each field.

### Real Project: AIGNE WebSmith Official Website

**Configuration file path**: `.aigne/web-smith/config.yaml`

This configuration file is the website configuration for the AIGNE WebSmith project itself, featuring:
- **Product type**: SaaS tool website
- **Target audience**: Developers and entrepreneurs
- **Website scale**: Single page website
- **Functional requirements**: Product showcase, quick conversion

#### Complete Configuration File Display

The following is the actual configuration file for the AIGNE WebSmith project (when machine recognition is required, the demo article should be displayed at the beginning. This bracketed content should not appear in the final document):

```yaml
projectName: AIGNE WebSmith
projectDesc: "AI-powered website generation tool built on the AIGNE Framework"
projectLogo: https://www.arcblock.io/content/uploads/2e5edbac4a7d5310f5c117d09601811c.png
projectId: pg4d0000-0000-4000-a000-000000000000
projectSlug: /
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
rules: |
  ### I. Core Messaging & Strategy: Foundational elements that define *what* you communicate to the user.
  1. Answer Critical Questions "Above the Fold": The very first screen a user sees must clearly and immediately answer:
    * What it is: A concise description of the product.
    * Who it's for: The specific target audience (e.g., solo founders, small teams).
    * Why it's different: Your unique value proposition (e.g., "open, composable, exportable code, agent workflow").
    * Primary Action: A single, clear Call to Action (CTA) that aligns with the user's main goal.
  2. Establish Credibility with Proof: Don't expect users to trust your claims. Show them proof early in the narrative.
    * Show, Don't Just Tell: The most powerful proof is a demo. Include a short (30-45s) silent video loop or a link to a real site built with the tool.
    * Use Social Proof: Before explaining "How it Works," insert tangible evidence like a customer logo, a compelling data point (e.g., "Used by 50+ teams"), or a strong user quote.
  3. Define a Clear Call to Action (CTA):
    * Align CTA with the Audience: The primary CTA should be the main action you want your target user to take (e.g., "Generate My Site").
    * Prioritize CTAs: Relegate secondary actions (like "See it on GitHub") to less prominent positions (tertiary buttons or footer links), especially for non-developer audiences.
    * Maintain a Persistent Mobile CTA: On mobile, a single primary CTA should always be visible.
locale: en
translateLanguages:
  - zh
  - zh-TW
  - ja
pagesDir: .aigne/web-smith/pages
sourcesPath:
  - ./assets/documents
  - ./README.md
  - ./aigne.yaml
  - ./assets/images
  - ./assets/recordings/README.md
  - ./CHANGELOG.md
  - ./agents
defaultDatasources:
  - ./media.md
media:
  minImageWidth: 600
lastGitHead: c4a4d3db4bf230e2c6873419e26b6654c39613a5
checkoutId: ""
projectCover: .aigne/web-smith/cover.png
shouldSyncAll: ""
navigationType: ""
appUrl: https://mhevtaeg.user.aigne.io
```

#### Detailed Configuration Field Analysis

Now let's analyze the key fields in this configuration file one by one:

##### 🏠 Project Basic Information (5 fields)

```yaml
projectName: AIGNE WebSmith
projectDesc: "AI-powered website generation tool built on the AIGNE Framework"
projectCover: .aigne/web-smith/cover.png
projectLogo: https://www.arcblock.io/content/uploads/2e5edbac4a7d5310f5c117d09601811c.png
projectId: pg4d0000-0000-4000-a000-000000000000
projectSlug: /
```

**Detailed field functions**:
- `projectName`: Website display name, affects page title (`<title>`), navigation menu, website logo
- `projectDesc`: SEO description, affects HTML meta tags, social media sharing description
- `projectCover`: Website cover image, used for preview and social sharing
- `projectLogo`: Website logo, affects page header navigation, browser favicon, social sharing thumbnail
- `projectId`: Unique identifier, affects deployment identification, project history, data source association
- `projectSlug`: URL path prefix, affects website deployment path and internal links

##### 🎯 Website Strategy Configuration (3 core fields)

```yaml
pagePurpose:
  - landingPage
targetAudienceTypes:
  - customers
websiteScale: singlePage
```

**Generation impact details**:
- `pagePurpose: landingPage`: Generation strategy focuses on conversion, will generate hero section, feature introduction, CTA buttons, FAQ sections, etc.
- `targetAudienceTypes: customers`: Writing style uses clear benefit-oriented language, emphasizing usability and effectiveness
- `websiteScale: singlePage`: Generate a single `/home` page, all content integrated into a scrollable page

##### 📝 Content Strategy Detailed Guidance

```yaml
rules: |
  ### I. Core Messaging & Strategy: Foundational elements that define *what* you communicate to the user.
  1. Answer Critical Questions "Above the Fold": The very first screen a user sees must clearly and immediately answer:
    * What it is: A concise description of the product.
    * Who it's for: The specific target audience (e.g., solo founders, small teams).
    * Why it's different: Your unique value proposition (e.g., "open, composable, exportable code, agent workflow").
    * Primary Action: A single, clear Call to Action (CTA) that aligns with the user's main goal.
  # ... Complete rules content
```

**Function of the `rules` field**:
- **Core guidance principles**: Provide detailed page structure, content organization, tone requirements
- **Specific implementation guidance**: Contains what content each section should include, how to organize information
- **Quality standards**: Ensure generated content meets brand tone and user expectations
- **Conversion optimization**: Focus on user conversion, includes clear CTA design and social proof strategy

##### 🌍 Multilingual Support Configuration

```yaml
locale: en
translateLanguages:
  - zh
  - zh-TW
  - ja
```

**Multilingual impact**:
- `locale: en`: Main language is English, AI generates content in English as the foundation first
- `translateLanguages`: Additionally generates Simplified Chinese, Traditional Chinese, and Japanese versions, each language has a complete website structure

##### 📁 Content Data Source Configuration

```yaml
sourcesPath:
  - ./assets/documents
  - ./README.md
  - ./aigne.yaml
  - ./assets/images
  - ./assets/recordings/README.md
  - ./CHANGELOG.md
  - ./agents
defaultDatasources:
  - ./media.md
```

**Data source function**:
- `sourcesPath`: Specifies content sources for AI agents to analyze, including documents, project descriptions, media files, agent code, etc.
- `defaultDatasources`: Default data injected into each page, such as media resource information

##### 🎨 Media and Deployment Configuration

```yaml
media:
  minImageWidth: 600
appUrl: https://mhevtaeg.user.aigne.io
checkoutId: ""
shouldSyncAll: ""
navigationType: ""
lastGitHead: c4a4d3db4bf230e2c6873419e26b6654c39613a5
```

**Deployment-related fields**:
- `media.minImageWidth`: Minimum image width 600px, ensures page visual effects
- `appUrl`: Website deployment URL, affects generated links and SEO
- `checkoutId`: ArcBlock deployment service identifier (empty value)
- `lastGitHead`: Records the last generated Git commit ID

#### Generation Result Verification

Based on this configuration, WebSmith generated:
- **Single page structure**: All content integrated on `/home` page
- **Multilingual versions**: English, Simplified Chinese, Traditional Chinese, Japanese, total of 4 language versions
- **Rich sections**: hero, feature introduction, working principle, target audience, differentiation advantages, demo, changelog, FAQ, final CTA
- **SEO optimization**: Complete meta information, social sharing images
- **Responsive design**: Layout adapted to various devices

This configuration perfectly demonstrates how to transform a SaaS product's marketing needs into a complete website structure.

---

## 📖 Configuration Field Details

### 🏠 Project Basic Information

#### `projectName`
**Function**: Project display name, shown in page titles and navigation
**Type**: string (required)
**Example**:
```yaml
projectName: "AIGNE WebSmith"  # Product name
projectName: "Zhang San | Full Stack Developer"  # Personal brand
projectName: "Green Life | Organic Skincare"  # Brand name + product category
```

**Modification impact**: After changing, the entire website's title and brand name will be updated

---

#### `projectDesc`
**Function**: Project description, used for SEO meta tags and internal prompts
**Type**: string (required)
**Example**:
```yaml
projectDesc: "AI-powered website generation tool built on the AIGNE Framework"
```

**Modification impact**: Affects search engine indexing and social media sharing descriptions

---

#### `projectId`
**Function**: Project's unique identifier, used by WebSmith service to identify projects
**Type**: UUID (required)
**Format**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
**Example**:
```yaml
projectId: pg4d0000-0000-4000-a000-000000000000
```

⚠️ **Important**: Do not easily modify project ID once set, as it will affect:
- Deployment link identification
- Project history
- Data source association

**Modification impact**: After changing, all related services need to be reconfigured

---

#### `projectLogo`
**Function**: Project logo, used for page header and social sharing
**Type**: URL (optional)
**Example**:
```yaml
projectLogo: "https://www.arcblock.io/content/uploads/logo.png"
projectLogo: "./assets/images/logo.svg"
```

**Modification impact**: After changing, the entire website's logo will be updated

---

#### `projectSlug`
**Function**: URL path prefix, affects website deployment path
**Type**: string (optional)
**Example**:
```yaml
projectSlug: "/"  # Root path
projectSlug: "/portfolio"  # /portfolio/xxx
projectSlug: "/docs"  # /docs/xxx
```

**Modification impact**: After changing, need to update domain and internal links

---

### 🎯 Website Strategy Configuration

#### `pagePurpose`
**Function**: Defines the main purpose of the website, directly affecting the AI agent's generation strategy
**Type**: list of enums (required)
**Available values**:
- `landingPage` - Marketing landing page, focused on conversion (optimized: clear value proposition, persuasive CTA, social proof)
- `ecommerce` - E-commerce website, online sales (optimized: product catalog, shopping cart, payment process, customer reviews)
- `portfolio` - Portfolio, showcasing projects and skills (optimized: visual presentation, project gallery, case studies)
- `corporate` - Corporate website, company information (optimized: company overview, services, team, contact information)
- `blog` - Blog, content sharing (optimized: content organization, SEO, social sharing, archiving)
- `saas` - SaaS product website (optimized: feature explanation, pricing, demo, user guidance)
- `nonprofit` - Non-profit organization (optimized: mission statement, donation process, volunteer registration)
- `education` - Educational website (optimized: course list, learning path, progress tracking)
- `mixedPurpose` - Multi-purpose website (optimized: balanced coverage, multiple user journeys)

**Actual generation impact**:
- **Landing Page**: Generate single page, containing hero section, feature introduction, CTA, FAQ
- **E-commerce**: Multi-page structure, containing product pages, shopping cart, checkout process
- **Portfolio**: Visual priority layout, project showcase as main focus
- **Corporate**: Formal corporate information structure

**Example**:
```yaml
# Single purpose - Most common configuration
pagePurpose:
  - landingPage

# Mixed purpose - Complex projects
pagePurpose:
  - corporate
  - blog
```

**Modification impact**: Changes the entire website's content strategy and page structure, requires regeneration

---

#### `targetAudienceTypes`
**Function**: Defines target audience, directly affecting AI agent's writing style and content expression
**Type**: list of enums (required)
**Available values**:
- `customers` - End users/customers (Writing: Clear benefits, simple language, trust signals)
- `businessOwners` - Business owners/entrepreneurs (Writing: ROI-oriented, time-saving, professional tone)
- `marketers` - Marketing teams (Writing: Marketing-focused, metric-driven, brand-aware)
- `designers` - Designers (Writing: Visual priority, aesthetic consideration, inspiration-driven)
- `developers` - Developers (Writing: Code priority, technical accuracy, implementation-focused)
- `investors` - Investors (Writing: Growth metrics, market opportunities, financial projections)
- `jobSeekers` - Job seekers (Writing: Culture-focused, career growth, benefit-oriented)
- `students` - Students (Writing: Educational tone, step-by-step guidance, progress tracking)
- `generalPublic` - General public (Writing: Understandable language, multiple entry points, broad appeal)

**Actual generation impact**:
- **customers**: Use simple benefit-oriented language, emphasizing usability and effectiveness
- **businessOwners**: Focus on ROI and business value, using professional formal tone
- **developers**: Provide technical details, code examples, API documentation
- **designers**: Value visual effects and design showcase

**Example**:
```yaml
# B2C product - Targeting end users
targetAudienceTypes:
  - customers
  - generalPublic

# B2B product - Targeting businesses and developers
targetAudienceTypes:
  - businessOwners
  - developers

# Professional services - Mixed audience
targetAudienceTypes:
  - businessOwners
  - customers
```

**Modification impact**: Changes page tone, case selection, action call button text, requires regeneration

---

#### `websiteScale`
**Function**: Defines website scale, controlling the number of generated pages and navigation structure complexity
**Type**: enum (required)
**Available values**:
- `singlePage` - Single page website (1 page)
  - Contains: All key information integrated into a scrollable page, containing multiple sections
  - Suitable for: landing page, simple portfolio, documentation site
- `minimal` - Minimal scale (2-6 pages)
  - Contains: Home, about, services/products, contact
  - Suitable for: MVP, landing page, simple business website
- `standard` - Standard scale (7-12 pages) **Recommended**
  - Contains: All minimal pages plus portfolio/blog, team, FAQ, pricing
  - Suitable for: Professional business website, portfolio, small e-commerce
- `comprehensive` - Comprehensive website (12+ pages)
  - Contains: All standard pages plus detailed service pages, case studies, resources
  - Suitable for: Large enterprises, complex products, content-rich sites
- `aiDecide` - Let AI decide scale
  - Range: Adaptive scale based on website type, audience, codebase analysis
  - AI considers: Business needs, content volume, maintenance capability

**Actual generation impact**:
- **singlePage**: Generate single `/home` page, disable other pages
- **minimal/standard/comprehensive**: Generate corresponding number of pages, including home, about, services, etc.
- **AI decision**: Intelligently recommend based on pagePurpose and targetAudience

**Example**:
```yaml
# MVP product showcase - Quick launch
websiteScale: singlePage

# Complete portfolio - Professional showcase
websiteScale: standard

# Complex product marketing - Comprehensive coverage
websiteScale: comprehensive
```

**Modification impact**: Directly determines the number and structure of generated pages, requires regenerating all pages

---

### 📝 Content Strategy Configuration

#### `rules`
**Function**: Detailed page generation guidance, containing structure, content, style requirements
**Type**: multiline string (optional, but strongly recommended)
**Format**: Detailed guidance in Markdown format

**Core elements**:

**1. Core Information Display Guidance**
```yaml
rules: |
  1. First screen must answer:
     * What the product is
     * Who the target users are
     * What the unique value is
     * What the main call to action is
```

**2. Page Structure Guidance**
```yaml
rules: |
  ### II. Page Structure
  1. Problem Statement: Main pain points users face
  2. Solution: How the product solves the problem
  3. How It Works: Simple usage process
  4. Quick Start: Specific operational guidance
  5. Frequently Asked Questions: FAQ section
```

**3. Content Style Guidance**
```yaml
rules: |
  ### III. Tone and Requirements
  * Use positive and affirmative language
  * Avoid excessive marketing jargon
  * Provide specific data and cases
  * Ensure information is accurate and verifiable
```

**Modification impact**: Rules is the most important guidance for generating content, directly determining page quality and user experience

---

#### `locale` and `translateLanguages`
**Function**: Multilingual support settings
**Type**: string and list of strings

**Example**:
```yaml
# Chinese main site, translated to English and Japanese
locale: zh
translateLanguages:
  - en
  - ja

# English main site, translated to Chinese and French
locale: en
translateLanguages:
  - zh
  - fr
```

**Modification impact**: After changing, it will affect the language generation of all pages, requiring regeneration of all content

---

### 📁 Data Source Configuration

#### `sourcesPath`
**Function**: Defines the content source directories/files for WebSmith to analyze
**Type**: list of paths

**Example**:
```yaml
sourcesPath:
  - ./assets/documents          # Document directory
  - ./README.md                # Project description
  - ./aigne.yaml               # Project configuration
  - ./assets/images            # Image resources
  - ./agents                   # Agent related
```

**Steps to add new data sources**:
1. Create data file (YAML/Markdown)
2. Add path in sourcesPath
3. Run `aigne run generate`

**Modification impact**: New data sources will affect content generation, requiring regeneration

---

#### `defaultDatasources`
**Function**: Default data sources injected into each page
**Type**: list of paths

**Example**:
```yaml
defaultDatasources:
  - ./media.md                 # Media resources
  - ./company-info.yaml        # Company information
  - ./contact-info.yaml        # Contact information
```

**Usage scenarios**:
- Unified contact information
- Brand logos and materials
- Common content snippets

---

### 🎨 Media and Display Configuration

#### `media.minImageWidth`
**Function**: Minimum image width requirement, filtering low-quality images
**Type**: integer (pixels)

**Recommended values for different types**:
```yaml
# Regular website
media:
  minImageWidth: 600

# Portfolio (requires high-quality display)
media:
  minImageWidth: 800

# E-commerce (product details important)
media:
  minImageWidth: 1000

# Premium brand (requires extremely high visual effects)
media:
  minImageWidth: 1200
```

**Modification impact**: After changing, available images will be re-filtered, affecting page visual effects

---

### 🚀 Deployment Configuration

#### `appUrl`
**Function**: Website deployment URL, affects generated links and SEO
**Type**: URL

**Example**:
```yaml
# Production environment
appUrl: https://www.yourdomain.com

# Test environment
appUrl: https://staging.yourdomain.com

# Development environment
appUrl: https://dev.yourdomain.com
```

**Modification impact**: After changing, all internal links need to be updated, it is recommended to set after determining the domain name

---

#### `checkoutId`
**Function**: Checkout identifier for ArcBlock deployment service
**Type**: string

**How to obtain**:
1. Create checkout in ArcBlock console
2. Copy checkout ID
3. Paste into configuration file

**Example**:
```yaml
checkoutId: "shop_checkout_001"
checkoutId: "saas_checkout_pro"
```

**Modification impact**: Affects website deployment to specified checkout service

---

#### `shouldSyncAll`
**Function**: Whether to sync all files to deployment service
**Type**: string ("true" or "")

**Usage recommendations**:
- Set to `"true"` for initial deployment
- Keep empty value for daily updates

---

## 🔍 Configuration and Actual Generation Correspondence

### How Configuration File Translates to Website

WebSmith uses the configuration file process:

1. **Configuration Reading** (`load-config.mjs`):
   - Parse `.aigne/web-smith/config.yaml`
   - Apply default values and field processing (`processConfigFields`)
   - Generate `projectSlug` (based on project name)
   - Collect all supported language lists

2. **Website Structure Planning** (`generate-website-structure.yaml`):
   - Generate structure based on `pagePurpose`, `targetAudienceTypes`, `websiteScale`
   - Use `rules` as detailed guidance principles
   - Analyze data sources in `sourcesPath`
   - Generate `website-structure.yaml` file

3. **Page Content Generation** (`generate-page-detail.yaml`):
   - Generate detailed YAML content for each page
   - Adjust writing style based on `targetAudienceTypes`
   - Choose appropriate components and layouts based on `pagePurpose`
   - Generate multilingual versions (based on `locale` and `translateLanguages`)

4. **File Output**:
   - Structure files: `.aigne/web-smith/pages/workspace/website-structure.yaml`
   - Page files: `.aigne/web-smith/pages/workspace/{locale}/page.yaml`
   - Navigation files: `.aigne/web-smith/pages/workspace/{locale}/_navigations.yaml`

### Actual Generated Page Example

**Single page website** (`websiteScale: singlePage`) generated page structure:
```
workspace/
├── website-structure.yaml     # Overall website structure
├── zh/
│   ├── _navigations.yaml     # Chinese navigation
│   └── home.yaml            # Main page content (containing all sections)
├── en/
│   ├── _navigations.yaml     # English navigation
│   └── home.yaml            # English main page
└── ja/
    ├── _navigations.yaml     # Japanese navigation
    └── home.yaml            # Japanese main page
```

**Multi-page website** (`websiteScale: standard`) generated page structure:
```
workspace/
├── website-structure.yaml     # Overall website structure
├── zh/
│   ├── _navigations.yaml     # Chinese navigation
│   ├── home.yaml            # Main page
│   ├── about.yaml           # About page
│   ├── services.yaml        # Services page
│   └── contact.yaml         # Contact page
└── en/
    ├── _navigations.yaml     # English navigation
    ├── home.yaml            # Main page
    ├── about.yaml           # About page
    ├── services.yaml        # Services page
    └── contact.yaml         # Contact page
```

### Specific Correspondence Between Configuration Fields and Generation Results

| Configuration Field | Impact Scope | Actual Effect |
|---------|---------|----------|
| `projectName` | Full site title, navigation, SEO | Page title, navigation menu display |
| `projectDesc` | SEO meta tags | HTML `<meta name="description">` |
| `pagePurpose` | Page structure and component selection | Hero section type, content organization method |
| `targetAudienceTypes` | Writing style and tone | Language complexity, case selection, CTA button text |
| `websiteScale` | Number of pages and navigation | Number of generated pages, navigation menu items |
| `rules` | Detailed generation guidance | Specific section content, layout requirements |
| `locale` | Main language version | Default generated content language |
| `translateLanguages` | Additional language versions | Additional generated translation versions |
| `sourcesPath` | Content material source | Specific information for page content |
| `media.minImageWidth` | Image quality control | Filtered image resources used |

### Common Modification Scenarios

#### Scenario 1: Change target audience
**Original configuration**:
```yaml
targetAudienceTypes:
  - customers
```

**Modified to**:
```yaml
targetAudienceTypes:
  - businessOwners
  - developers
```

**Effect**: Page tone changes from consumer-focused to business and developer-focused

#### Scenario 2: Upgrade from single page to multi-page
**Original configuration**:
```yaml
websiteScale: singlePage
pagePurpose:
  - landingPage
```

**Modified to**:
```yaml
websiteScale: standard
pagePurpose:
  - corporate
  - blog
```

**Effect**: Website expands from single page to multi-page complete website

#### Scenario 3: Add new language support
**Original configuration**:
```yaml
locale: en
translateLanguages:
  - zh
```

**Modified to**:
```yaml
locale: en
translateLanguages:
  - zh
  - fr
  - de
```

**Effect**: Website simultaneously generates English, Chinese, French, German versions

#### Scenario 4: Adjust image quality requirements
**Original configuration**:
```yaml
media:
  minImageWidth: 600
```

**Modified to**:
```yaml
media:
  minImageWidth: 1000
```

**Effect**: Only use high-quality images, page visual effects improved

### Post-modification Activation Process

#### 1. Modify Configuration
Edit `.aigne/web-smith/config.yaml` file

#### 2. Verify Configuration Syntax
```bash
# Check if YAML syntax is correct
python -c "import yaml; yaml.safe_load(open('.aigne/web-smith/config.yaml'))"
```

#### 3. Regenerate Website
```bash
# Complete regeneration
aigne run generate

# Only update existing pages
aigne run update
```

#### 4. Check Generation Results
- Check generated page content
- Verify links and navigation
- Confirm multilingual versions (if any)

#### 5. Deploy Updates
```bash
# Deploy to production environment
aigne run deploy
```

---

## ⭐ Best Practices

### 1. Project Configuration Management

#### Use Version Control
```bash
git add .aigne/web-smith/config.yaml
git commit -m "Update website configuration"
```

#### Backup Important Configurations
```bash
cp .aigne/web-smith/config.yaml config-backup-$(date +%Y%m%d).yaml
```

#### Team Collaboration Standards
- Use unified configuration templates
- Validate in test environment before important modifications
- Establish approval process for configuration changes

### 2. Performance Optimization

#### Image Optimization
```yaml
# Set appropriate image dimensions based on website type
media:
  minImageWidth: 800  # Balance quality and loading speed
```

#### Loading Speed Optimization
- Match `websiteScale` with actual needs
- Avoid adding unnecessary data sources
- Regularly clean up unused media files

### 3. SEO Optimization

#### Project Description Optimization
```yaml
# Include core keywords
projectDesc: "AI-powered website generation tool built on the AIGNE Framework"

# Keep description within 150 characters for search engine display
```

#### URL Structure Optimization
```yaml
# Use meaningful projectSlug
projectSlug: "/portfolio"      # Portfolio
projectSlug: "/docs"           # Documentation
projectSlug: "/shop"           # Store
```

### 4. Multilingual Support

#### Language Code Standards
```yaml
# Use standard IETF language codes
locale: "zh"       # Chinese
locale: "zh-CN"    # Simplified Chinese
locale: "zh-TW"    # Traditional Chinese
locale: "en"       # English
locale: "ja"       # Japanese
```

#### Content Localization Considerations
- Ensure translated content matches local cultural habits
- Note text length differences in different languages
- Provide appropriate contact information and payment methods

### 5. Deployment and Updates

#### Pre-deployment Checklist
- [ ] Project information complete and accurate
- [ ] Target audience settings correct
- [ ] Data source paths valid
- [ ] Image resources meet quality requirements
- [ ] Deployment URL correctly configured

#### Update Strategy
```bash
# Daily minor updates
aigne run update

# Major modifications
aigne run generate

# Complete rebuild (use with caution)
rm -rf .aigne/web-smith/pages/
aigne run generate
```

---

## ❓ Common Questions

### Q1: How to handle configuration for large projects?

**Project scale**: 20+ page comprehensive website

**Recommended solution**:
```yaml
# 1. Use comprehensive scale
websiteScale: comprehensive

# 2. Modular data sources
sourcesPath:
  - ./content/homepage/          # Homepage content
  - ./content/products/          # Product pages
  - ./content/about/             # About pages
  - ./content/blog/              # Blog content
  - ./assets/common/             # Common resources

# 3. Phased generation and deployment
# Generate core pages first, then expand gradually
```

### Q2: Generated page content does not meet expectations?

**Possible reasons**:
1. `rules` configuration not detailed enough
2. `targetAudienceTypes` setting inappropriate
3. `sourcesPath` content insufficient

**Solutions**:
```yaml
# 1. Improve rules configuration, provide more specific guidance
rules: |
  ### I. Page Structure Requirements
  1. First screen includes:
     * Clear product title
     * Concise product description
     * Main call to action button

  2. Content requirements:
     * Use positive and affirmative tone
     * Provide specific case data
     * Avoid excessive marketing jargon

# 2. Adjust target audience
targetAudienceTypes:
  - businessOwners  # Change to more specific audience

# 3. Add more content sources
sourcesPath:
  - ./brand-story.md      # Brand story
  - ./product-features.md # Product features
  - ./customer-cases.md   # Customer cases
```

### Q3: Multilingual version generation fails?

**Possible reasons**:
1. Translation language code error
2. Original content does not support target language
3. Font or character encoding issues

**Solutions**:
```yaml
# 1. Use correct language codes
translateLanguages:
  - "zh-CN"   # Simplified Chinese
  - "zh-TW"   # Traditional Chinese
  - "en"      # English
  - "ja"      # Japanese

# 2. Check source content encoding
file -i assets/documents/*.md

# 3. Ensure target language support
locale: "zh"  # Main language
translateLanguages:
  - "en"      # English translation
  - "ja"      # Japanese translation
```

### Q4: Poor image display quality or images not showing?

**Possible reasons**:
1. `minImageWidth` setting too high
2. Image file corrupted or path error
3. Image format not supported

**Solutions**:
```yaml
# 1. Lower image quality requirements
media:
  minImageWidth: 600  # Reduce from 800 to 600

# 2. Check image files
ls -la assets/images/
file assets/images/*.jpg

# 3. Use supported image formats
# Supported: jpg, jpeg, png, gif, webp, svg
```
