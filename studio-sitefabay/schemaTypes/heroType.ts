import {defineField, defineType} from 'sanity'

export const heroType = defineType({
  name: 'hero',
  title: 'Hero Section (Início)',
  type: 'document',
  fields: [
    defineField({
      name: 'badge',
      title: 'Badge (ex: Nova Coleção 2025)',
      type: 'string',
      initialValue: 'Nova Coleção 2025',
    }),
    defineField({
      name: 'headline',
      title: 'Título Principal',
      type: 'string',
      initialValue: 'A Energia do Jogo.',
    }),
    defineField({
      name: 'subtext',
      title: 'Subtexto',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Botão Principal (ex: Compre Agora)',
      type: 'string',
      initialValue: 'Compre Agora',
    }),
    defineField({
      name: 'ctaSecondaryLabel',
      title: 'Botão Secundário (ex: Ver Coleção)',
      type: 'string',
      initialValue: 'Ver Coleção',
    }),
  ],
  preview: {
    select: {title: 'headline'},
  },
})
