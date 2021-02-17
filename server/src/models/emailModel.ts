import mongoose from 'mongoose'

interface IEmail {
  email: string
}

interface IEmailModel extends mongoose.Model<IEmailDocument> {
  build(attr: IEmail): IEmailDocument
}

interface IEmailDocument extends mongoose.Document {
  email: string
}

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
})

emailSchema.statics.build = (attr: IEmail) => {
  return new Email(attr)
}

const Email = mongoose.model<IEmailDocument, IEmailModel>('Email', emailSchema)

export { Email }
