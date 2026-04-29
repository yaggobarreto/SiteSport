import {defineField, defineType} from 'sanity'

export const featuredSectionType = defineType({
  name: 'featuredSection',
  title: 'Seção de Destaque (Meio do Site)',
  type: 'document',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Texto Menor (Acima do Título)',
      type: 'string',
      initialValue: 'Destaque da Temporada',
      description: 'Exemplo: "Destaque da Temporada" ou "Mais Vendido"',
    }),
    defineField({
      name: 'product',
      title: 'Produto Selecionado',
      type: 'reference',
      to: [{type: 'product'}],
      description: 'Escolha qual produto vai aparecer gigante nesta seção.',
    }),
    defineField({
      name: 'customDescription',
      title: 'Texto Personalizado (Opcional)',
      type: 'text',
      description: 'Se preencher aqui, este texto vai substituir a descrição padrão do produto nesta seção.',
    }),
  ],
  preview: {
    select: {
      title: 'tagline',
      subtitle: 'product.name',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Seção de Destaque',
        subtitle: subtitle ? `Mostrando: ${subtitle}` : 'Nenhum produto selecionado',
      }
    }
  },
})
