import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Produto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome do Produto',
      type: 'string',
      validation: (Rule) => Rule.required().error('O nome é obrigatório'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Preço (R$)',
      type: 'number',
      validation: (Rule) => Rule.required().positive().error('Informe um preço válido'),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Preço Original (antes do desconto)',
      type: 'number',
    }),
    defineField({
      name: 'badge',
      title: 'Badge (ex: Novo, Oferta, Exclusivo)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagem Principal',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required().error('Adicione uma imagem'),
    }),
    defineField({
      name: 'images',
      title: 'Galeria de Imagens',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'sizes',
      title: 'Tamanhos Disponíveis',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'PP', value: 'PP'},
          {title: 'P', value: 'P'},
          {title: 'M', value: 'M'},
          {title: 'G', value: 'G'},
          {title: 'GG', value: 'GG'},
          {title: 'XGG', value: 'XGG'},
        ],
        layout: 'grid',
      },
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          {title: 'Camisa', value: 'camisa'},
          {title: 'Short', value: 'short'},
          {title: 'Conjunto', value: 'conjunto'},
          {title: 'Acessório', value: 'acessorio'},
          {title: 'Jaqueta', value: 'jaqueta'},
        ],
        layout: 'radio',
      },
      initialValue: 'camisa',
    }),
    defineField({
      name: 'featured',
      title: 'Produto em Destaque?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'inStock',
      title: 'Em Estoque?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'checkoutUrl',
      title: 'Link de Check-out / WhatsApp',
      description: 'Link para o InfinityPay, Checkout ou WhatsApp do Produto',
      type: 'url',
    }),
    defineField({
      name: 'order',
      title: 'Ordem de Exibição (menor = primeiro)',
      type: 'number',
      initialValue: 99,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'mainImage',
      price: 'price',
      inStock: 'inStock',
    },
    prepare({title, media, price, inStock}) {
      return {
        title,
        media,
        subtitle: `R$ ${price?.toFixed(2)} ${inStock ? '✅ Em Estoque' : '❌ Fora de Estoque'}`,
      }
    },
  },
})
