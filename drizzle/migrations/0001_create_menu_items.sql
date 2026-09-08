CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'drink',
  emoji text NOT NULL DEFAULT '',
  image_id text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "menu items public read" ON public.menu_items
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin insert menu items" ON public.menu_items
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin update menu items" ON public.menu_items
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admin delete menu items" ON public.menu_items
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.menu_items (slug, name, description, price, category, emoji, image_id, sort_order) VALUES
('butterscotch','Butterscotch','Sirup butterscotch premium.',18000,'drink','🧈','butterscotch',1),
('caramel','Caramel','Rasa karamel yang manis dan creamy.',18000,'drink','🍯','caramel',2),
('hazelnut','Hazelnut','Aroma hazelnut yang kaya dan nutty.',18000,'drink','🌰','hazelnut',3),
('pandan','Pandan','Rasa pandan khas dan harum.',18000,'drink','🌿','pandan',4),
('aren','Aren','Gula aren alami yang earthy.',18000,'drink','🟤','aren',5),
('vanilla','Vanilla','Vanilla klasik yang lembut.',18000,'drink','🤍','vanilla',6),
('scoffey-signature','Scoffey Signature','Racikan khas Scoffey.',16500,'drink','⭐','scoffey-signature',7),
('classic-sweet','Classic Sweet','Manis klasik yang pas.',13500,'drink','☕','classic-sweet',8),
('choco-butterscotch','Choco Butterscotch','Paduan cokelat dan butterscotch.',17500,'drink','🍫','choco-butterscotch',9),
('choco-caramel','Choco Caramel','Cokelat bertemu karamel.',17500,'drink','🍫','choco-caramel',10),
('choco-vanilla','Choco Vanilla','Cokelat creamy dengan vanilla.',17500,'drink','🍫','choco-vanilla',11),
('choco-pandan','Choco Pandan','Cokelat harum dengan pandan.',17500,'drink','🍫','choco-pandan',12),
('brown-matcha','Brown Matcha','Matcha dengan sentuhan gula aren.',17500,'drink','🍵','brown-matcha',13),
('chocolate-menu','Chocolate','Cokelat manis klasik.',15000,'drink','🍫','chocolate',14),
('matcha-menu','Matcha','Matcha premium yang earthy.',15000,'drink','🍵','matcha',15),
('red-velvet','Red Velvet','Red velvet yang lembut dan creamy.',15000,'drink','🍰','red-velvet',16),
('strawberry','Strawberry','Rasa stroberi yang segar.',15000,'drink','🍓','strawberry',17),
('americano-menu','Americano','Espresso yang ringan dan bersih.',13000,'drink','🫙','americano',18),
('espresso-addon','Espresso Shot (Add On)','Tambahan shot espresso.',3000,'drink','⚡','espresso',19),
('lempeng','Lempeng','Kue tipis gurih, pas teman ngopi.',15000,'food','🫓','food-lempeng',1),
('tapai-goreng','Tapai Goreng','Tapai goreng renyah dengan rasa manis.',15000,'food','🍘','food-tapai-goreng',2),
('tahu-bakso','Tahu Bakso','Tahu isi bakso gurih hangat.',20000,'food','🥟','food-tahu-bakso',3),
('tempe-mendoan','Tempe Mendoan','Tempe goreng tepung khas Banyumas.',20000,'food','🍘','food-tempe-mendoan',4),
('pisang-aroma','Pisang Aroma','Pisang goreng renyah beraroma vanila.',20000,'food','🍌','food-pisang-aroma',5),
('tahu-krispy','Tahu Krispy','Tahu goreng crispy dengan bumbu lezat.',15000,'food','🧈','food-tahu-krispy',6),
('pisang-roll','Pisang Roll','Pisang gulung kulit lumpia renyah.',15000,'food','🍥','food-pisang-roll',7),
('french-fries','French Fries','Kentang goreng renyah klasik.',20000,'food','🍟','food-french-fries',8),
('singkong-goreng','Singkong Goreng','Singkong goreng empuk, taburan gula aren.',20000,'food','🍠','food-singkong-goreng',9);

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;