
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#8B0000', // Đỏ đậm truyền thống (Akane)
					foreground: '#FFFFFF',
				},
				secondary: {
					DEFAULT: '#D4AF37', // Vàng kim truyền thống (Kiniro)
					foreground: '#000000',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: '#2F4F2F', // Xanh lá cây đậm (Rokusho)
					foreground: '#FFFFFF',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				japanese: {
					sumi: '#1C1C1C', // Đen mực Nhật (Sumi)
					washi: '#F8F5F0', // Trắng giấy washi
					bamboo: '#4A5D23', // Xanh tre
					sakura: '#FFB7C5', // Hồng hoa anh đào
					matcha: '#7FB069', // Xanh matcha
					wood: '#8B4513', // Nâu gỗ
					stone: '#708090', // Xám đá
					indigo: '#4B0082', // Tím indigo (Ai)
					vermillion: '#FF4500', // Đỏ son (Shu)
					gold: '#FFD700', // Vàng (Kin)
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"float": {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"fade-slide": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"float": "float 3s ease-in-out infinite",
				"fade-slide": "fade-slide 0.8s ease-out"
			},
			backgroundImage: {
				'hero-pattern': "url('https://images.unsplash.com/photo-1624300629298-8d4dff2ac570?q=80&w=2070')",
				'bamboo-pattern': "url('https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=3634')",
				'zen-pattern': "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=7360')",
			},
			fontFamily: {
				'japanese': ['Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'sans-serif'],
				'japanese-serif': ['Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', 'serif'],
			},
			boxShadow: {
				'japanese': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(139, 0, 0, 0.06)',
				'paper': '0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(139, 0, 0, 0.05)',
			}
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
