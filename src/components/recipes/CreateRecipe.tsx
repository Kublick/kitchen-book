"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { EditorContent } from "@tiptap/react";
import { useRecipeEditor } from "@/components/editor/use-recipe-editor";
import "filepond/dist/filepond.min.css";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { createRecipe } from "@/actions/recipe/create-recipe";
import { useRouter } from "next/navigation";

// import { useToast } from "@/components/ui/use-toast";

// import { DevTool } from "@hookform/devtools";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "El titulo es requerido.",
  }),
  portions: z.number().min(1, "Ingrese la cantidad de porciones"),
  prepTime: z.number().min(1, "Ingrese un tiempo de preparación"),
  cookTime: z.number().min(1, "Ingrese el tiempo de cocción"),
  procedure: z.string({ required_error: "El procedimiento es requerido." }),
  description: z.string({ required_error: "La descripcion es requerida." }),
  categoryId: z.number({ required_error: "La categoria es requerida." }),
  images: z.custom<File[]>().nullable(),
});

interface PageProps {
  categories: {
    id: number;
    name: string;
  }[];
}

interface ResponseData {
  imageNames: string[];
}

registerPlugin(FilePondPluginImagePreview);

export function CreateRecipeForm({ categories }: PageProps) {
  const router = useRouter();
  const { editor } = useRecipeEditor({ content: "" });
  const { editor: ingredientEditor } = useRecipeEditor({ content: "" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      procedure: "",
      description: "",
      categoryId: 1,
      portions: 0,
      cookTime: 0,
      prepTime: 0,
      images: null,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("categoryId", values.categoryId.toString());
    formData.append("portions", values.portions.toString());
    formData.append("prepTime", values.prepTime.toString());
    formData.append("cookTime", values.cookTime.toString());
    formData.append("procedure", editor?.getHTML() ?? "");
    formData.append("ingredients", ingredientEditor?.getHTML() ?? "");

    if (values.images && values.images.length > 0) {
      for (let i = 0; i < values.images.length; i++) {
        formData.append("images", values.images[i], values.images[i].name);
      }
    }

    await createRecipe(formData);

    router.push("/");
  }

  return (
    <div className="pb-4">
      <div className="bg-primary p-4 mb-4">
        <h1 className="text-xl md:text-3xl text-white text-bold">
          Recetario de mi ama / Registro de recetas
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre receta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripcion</FormLabel>
                    <FormControl>
                      <Input placeholder="Descripcion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name={"categoryId"}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            console.log(value);
                            field.onChange(Number(value));
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                value={category.id.toString()}
                                key={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="portions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porciones</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Porciones por receta"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            field.onChange(
                              e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="prepTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiempo de preparación</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tiempo de preparación"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cookTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiempo de cocción</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tiempo de preparación"
                        {...field}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="py-4">Ingredientes</FormLabel>
                <div className="divide-y divide-gray-100 border border-gray-600 transition-colors focus-within:border-indigo-600">
                  <EditorToolbar editor={ingredientEditor} />
                  <EditorContent editor={ingredientEditor} />
                </div>
              </div>
              <div>
                <FormLabel className="py-4">Procedimiento</FormLabel>
                <div className="divide-y divide-gray-100 border border-gray-600 transition-colors focus-within:border-indigo-600">
                  <EditorToolbar editor={editor} />
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
            <div>
              <FormField
                control={form.control}
                name="images"
                render={({ field: { onChange, value, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel className="py-4">
                      Imagenes <span className="text-xs">(3 maximo)</span>
                    </FormLabel>
                    <FormControl>
                      <FilePond
                        acceptedFileTypes={[
                          "image/jpeg",
                          "image/png",
                          "image/webp",
                        ]}
                        files={value as File[]}
                        onupdatefiles={(fileItems) => {
                          const files = fileItems.map(
                            (fileItem) => fileItem.file
                          );
                          onChange(files);
                        }}
                        allowMultiple={true}
                        maxFiles={3}
                        name="images"
                        labelIdle='Arrastra tus archivos o <span class="filepond--label-action">Seleccionalos</span>'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
