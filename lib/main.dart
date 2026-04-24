import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(const HydroGuardApp());
}

class HydroGuardApp extends StatelessWidget {
  const HydroGuardApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HydroGuard',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        primarySwatch: Colors.blue,
        fontFamily: 'Poppins',
      ),
      home: const HomeScreen(),
    );
  }
}
